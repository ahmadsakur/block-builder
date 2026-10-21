import type { User } from "@supabase/supabase-js";
import { env } from "@/env";
import { squareImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import {
  AVATAR_REMOVE_FAILED,
  AVATAR_UPLOAD_FAILED,
  authErrorMessage,
  CONFIRM_EMAIL_FIRST,
  SIGNED_OUT_ERROR,
  toAuthUser,
  WRONG_CURRENT_PASSWORD,
} from "../logic/auth.logic";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  ProfileInput,
  Session,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

type AuthFailure = { code?: string; message?: string } | null;
type SupabaseClient = ReturnType<typeof createClient>;

const AVATAR_BUCKET = "avatars";
const AVATAR_SIZE_PX = 256;
const AVATAR_CACHE_SECONDS = "31536000";
const MAX_LISTED_FILES = 1000;

function check(error: AuthFailure): asserts error is null {
  if (error) throw new Error(authErrorMessage(error));
}

function toSession(user: User): Session {
  return { user: toAuthUser(user) };
}

async function currentUser(): Promise<User> {
  const { data } = await createClient().auth.getUser();
  if (!data.user) throw new Error(SIGNED_OUT_ERROR);
  return data.user;
}

export async function getSession(): Promise<Session | null> {
  const { data } = await createClient().auth.getUser();
  return data.user ? toSession(data.user) : null;
}

export async function signIn({
  email,
  password,
}: SignInInput): Promise<Session> {
  const { data, error } = await createClient().auth.signInWithPassword({
    email,
    password,
  });
  check(error);
  return toSession(data.user);
}

export async function signUp({
  name,
  email,
  password,
}: SignUpInput): Promise<Session> {
  const { data, error } = await createClient().auth.signUp({
    email,
    options: { data: { name } },
    password,
  });
  check(error);
  if (!data.user || !data.session) throw new Error(CONFIRM_EMAIL_FIRST);
  return toSession(data.user);
}

export async function requestPasswordReset({
  email,
}: ForgotPasswordInput): Promise<void> {
  const { error } = await createClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
  check(error);
}

export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}): Promise<void> {
  const supabase = createClient();
  const exchange = await supabase.auth.exchangeCodeForSession(token);
  check(exchange.error);
  const update = await supabase.auth.updateUser({ password });
  check(update.error);
  await supabase.auth.signOut({ scope: "local" });
}

export async function signOut(): Promise<void> {
  const { error } = await createClient().auth.signOut();
  check(error);
}

export async function updateProfile({
  name,
  email,
}: ProfileInput): Promise<Session> {
  const user = await currentUser();
  const { data, error } = await createClient().auth.updateUser({
    data: { name },
    ...(email === user.email ? {} : { email }),
  });
  check(error);
  return toSession(data.user);
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  const user = await currentUser();
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email ?? "",
    password: currentPassword,
  });
  if (error) {
    throw new Error(
      error.code === "invalid_credentials"
        ? WRONG_CURRENT_PASSWORD
        : authErrorMessage(error),
    );
  }
  const update = await supabase.auth.updateUser({ password: newPassword });
  check(update.error);
}

async function sweepAvatars(
  supabase: SupabaseClient,
  userId: string,
  keep?: string,
): Promise<boolean> {
  const bucket = supabase.storage.from(AVATAR_BUCKET);
  const { data, error } = await bucket.list(userId, {
    limit: MAX_LISTED_FILES,
  });
  if (error) return false;
  const stale = data
    .map((file) => `${userId}/${file.name}`)
    .filter((path) => path !== keep);
  if (stale.length === 0) return true;
  const removed = await bucket.remove(stale);
  return !removed.error;
}

export async function uploadAvatar(file: Blob): Promise<Session> {
  const user = await currentUser();
  const supabase = createClient();
  const bucket = supabase.storage.from(AVATAR_BUCKET);
  const image = await squareImage(file, AVATAR_SIZE_PX);
  const path = `${user.id}/${crypto.randomUUID()}.webp`;

  const upload = await bucket.upload(path, image, {
    cacheControl: AVATAR_CACHE_SECONDS,
    contentType: "image/webp",
  });
  if (upload.error) throw new Error(AVATAR_UPLOAD_FAILED);

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(path);
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });
  if (error) {
    await bucket.remove([path]);
    throw new Error(authErrorMessage(error));
  }

  await sweepAvatars(supabase, user.id, path);
  return toSession(data.user);
}

export async function removeAvatar(): Promise<Session> {
  const user = await currentUser();
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_url: null },
  });
  check(error);
  await sweepAvatars(supabase, user.id);
  return toSession(data.user);
}

export async function deleteAccount(): Promise<void> {
  const user = await currentUser();
  const supabase = createClient();
  if (!(await sweepAvatars(supabase, user.id))) {
    throw new Error(AVATAR_REMOVE_FAILED);
  }
  const { error } = await supabase.rpc("delete_own_account");
  check(error);
  await supabase.auth.signOut({ scope: "local" });
}
