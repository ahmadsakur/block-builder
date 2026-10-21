import { beforeEach, expect, test, vi } from "vitest";
import {
  changePassword,
  deleteAccount,
  getSession,
  resetPassword,
  signIn,
  signUp,
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

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth, rpc }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  auth.getUser.mockResolvedValue({ data: { user: USER }, error: null });
  auth.signOut.mockResolvedValue(OK);
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

test("deleteAccount calls the database function, then signs out", async () => {
  rpc.mockResolvedValue(OK);
  await deleteAccount();
  expect(rpc).toHaveBeenCalledWith("delete_own_account");
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
});
