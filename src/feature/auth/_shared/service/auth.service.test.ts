import { beforeEach, expect, test, vi } from "vitest";
import {
  changePassword,
  deleteAccount,
  getSession,
  removeAvatar,
  resetPassword,
  signIn,
  signUp,
  uploadAvatar,
} from "./auth.service";

const USER = {
  email: "jane@acme.com",
  id: "user-1",
  user_metadata: { name: "Jane Doe" },
};
const OK = { error: null };
const fail = (code: string) => ({
  data: { session: null, user: null },
  error: { code, message: code },
});

const auth = {
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updateUser: vi.fn(),
};
const rpc = vi.fn();
const bucket = {
  getPublicUrl: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  upload: vi.fn(),
};
const storage = { from: vi.fn(() => bucket) };

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth, rpc, storage }),
}));

vi.mock("@/lib/image", () => ({
  squareImage: vi.fn(async () => new Blob(["webp"], { type: "image/webp" })),
}));

beforeEach(() => {
  vi.resetAllMocks();
  auth.getUser.mockResolvedValue({ data: { user: USER }, error: null });
  auth.signOut.mockResolvedValue(OK);
  storage.from.mockReturnValue(bucket);
  bucket.upload.mockResolvedValue({ data: {}, error: null });
  bucket.getPublicUrl.mockImplementation((path: string) => ({
    data: { publicUrl: `https://cdn/avatars/${path}` },
  }));
  bucket.list.mockResolvedValue({
    data: [{ name: "old.webp" }],
    error: null,
  });
  bucket.remove.mockResolvedValue({ data: [], error: null });
});

test("getSession returns the signed-in user, or null", async () => {
  await expect(getSession()).resolves.toEqual({
    user: {
      avatarUrl: undefined,
      email: "jane@acme.com",
      id: "user-1",
      name: "Jane Doe",
    },
  });
  auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
  await expect(getSession()).resolves.toBeNull();
});

test("signIn throws our copy for wrong credentials", async () => {
  auth.signInWithPassword.mockResolvedValue(fail("invalid_credentials"));
  await expect(
    signIn({ email: "jane@acme.com", password: "nope" }),
  ).rejects.toThrow("That email and password don't match.");
});

test("signUp asks to confirm the email when Supabase returns no session", async () => {
  auth.signUp.mockResolvedValue({
    data: { session: null, user: USER },
    error: null,
  });
  await expect(
    signUp({ email: "jane@acme.com", name: "Jane", password: "secret-123" }),
  ).rejects.toThrow("Check your email to confirm your account");
  expect(auth.signUp).toHaveBeenCalledWith({
    email: "jane@acme.com",
    options: { data: { name: "Jane" } },
    password: "secret-123",
  });
});

test("resetPassword exchanges the code, sets the password, then signs out", async () => {
  auth.exchangeCodeForSession.mockResolvedValue({
    data: { session: {}, user: USER },
    error: null,
  });
  auth.updateUser.mockResolvedValue({ data: { user: USER }, error: null });
  await resetPassword({ password: "new-password-1", token: "code-1" });
  expect(auth.exchangeCodeForSession).toHaveBeenCalledWith("code-1");
  expect(auth.updateUser).toHaveBeenCalledWith({ password: "new-password-1" });
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
});

test("resetPassword explains an expired or foreign-browser link", async () => {
  auth.exchangeCodeForSession.mockResolvedValue(fail("flow_state_not_found"));
  await expect(
    resetPassword({ password: "new-password-1", token: "old" }),
  ).rejects.toThrow("This reset link has expired");
  expect(auth.updateUser).not.toHaveBeenCalled();
});

test("changePassword rejects a wrong current password", async () => {
  auth.signInWithPassword.mockResolvedValue(fail("invalid_credentials"));
  await expect(
    changePassword({
      confirmPassword: "new-password-1",
      currentPassword: "wrong",
      newPassword: "new-password-1",
    }),
  ).rejects.toThrow("Your current password is incorrect.");
  expect(auth.updateUser).not.toHaveBeenCalled();
});

test("deleteAccount removes the user's files, then the user, then signs out", async () => {
  rpc.mockResolvedValue(OK);
  await deleteAccount();
  expect(bucket.list).toHaveBeenCalledWith("user-1", { limit: 1000 });
  expect(bucket.remove).toHaveBeenCalledWith(["user-1/old.webp"]);
  expect(rpc).toHaveBeenCalledWith("delete_own_account");
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
});

test("deleteAccount keeps the user when their files can't be removed", async () => {
  bucket.remove.mockResolvedValue({ data: null, error: { message: "no" } });
  await expect(deleteAccount()).rejects.toThrow("Couldn't remove your photo");
  expect(rpc).not.toHaveBeenCalled();
});

test("uploadAvatar stores a new file, saves its URL, and sweeps the old ones", async () => {
  bucket.list.mockResolvedValue({
    data: [{ name: "old.webp" }, { name: "stray.webp" }],
    error: null,
  });
  auth.updateUser.mockImplementation(async ({ data }) => ({
    data: {
      user: { ...USER, user_metadata: { ...USER.user_metadata, ...data } },
    },
    error: null,
  }));

  const session = await uploadAvatar(new Blob(["png"]));

  const [path] = bucket.upload.mock.calls[0];
  expect(path).toMatch(/^user-1\/[\w-]+\.webp$/);
  expect(session.user.avatarUrl).toBe(`https://cdn/avatars/${path}`);
  expect(bucket.remove).toHaveBeenCalledWith([
    "user-1/old.webp",
    "user-1/stray.webp",
  ]);
});

test("uploadAvatar deletes the new file when saving its URL fails", async () => {
  auth.updateUser.mockResolvedValue(fail("over_request_rate_limit"));
  await expect(uploadAvatar(new Blob(["png"]))).rejects.toThrow(
    "Too many attempts",
  );
  const [path] = bucket.upload.mock.calls[0];
  expect(bucket.remove).toHaveBeenCalledWith([path]);
  expect(bucket.list).not.toHaveBeenCalled();
});

test("uploadAvatar reports a failed upload without touching the user", async () => {
  bucket.upload.mockResolvedValue({ data: null, error: { message: "413" } });
  await expect(uploadAvatar(new Blob(["png"]))).rejects.toThrow(
    "Couldn't upload your photo. Try again.",
  );
  expect(auth.updateUser).not.toHaveBeenCalled();
});

test("removeAvatar clears the URL and empties the folder", async () => {
  auth.updateUser.mockResolvedValue({
    data: { user: { ...USER, user_metadata: { name: "Jane Doe" } } },
    error: null,
  });
  const session = await removeAvatar();
  expect(auth.updateUser).toHaveBeenCalledWith({ data: { avatar_url: null } });
  expect(bucket.remove).toHaveBeenCalledWith(["user-1/old.webp"]);
  expect(session.user.avatarUrl).toBeUndefined();
});
