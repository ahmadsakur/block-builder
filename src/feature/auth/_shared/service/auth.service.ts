import type { User } from "@supabase/supabase-js";
import { env } from "@/env";
import { createClient } from "@/lib/supabase/client";
import {
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

export async function deleteAccount(): Promise<void> {
  await currentUser();
  const supabase = createClient();
  const { error } = await supabase.rpc("delete_own_account");
  check(error);
  await supabase.auth.signOut({ scope: "local" });
}
