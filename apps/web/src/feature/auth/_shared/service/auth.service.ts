import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { squareImage } from "@/lib/image";
import { authErrorMessage, homeFor, toSession } from "../logic/auth.logic";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  ProfileInput,
  Session,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

const AVATAR_SIZE_PX = 256;
const VERIFIED_URL = `${env.NEXT_PUBLIC_APP_URL}${homeFor("user")}`;

type AuthError = { code?: string; message?: string };

async function unwrap<T>(
  response: Promise<{ data: T | null; error: AuthError | null }>,
): Promise<NonNullable<T>> {
  const { data, error } = await response;
  if (error || !data) throw new Error(authErrorMessage(error ?? {}));
  return data;
}

async function request(path: string, init: RequestInit): Promise<void> {
  const response = await fetch(path, init);
  if (response.ok) return;
  const body: AuthError = await response.json().catch(() => ({}));
  throw new Error(authErrorMessage(body));
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(authErrorMessage(error));
  return data ? toSession(data.user) : null;
}

async function currentSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("You're signed out. Sign in again.");
  return session;
}

export async function signIn(input: SignInInput): Promise<Session> {
  const { user } = await unwrap(
    authClient.signIn.email({ ...input, callbackURL: VERIFIED_URL }),
  );
  return toSession(user);
}

export async function signUp(input: SignUpInput): Promise<void> {
  await unwrap(
    authClient.signUp.email({ ...input, callbackURL: VERIFIED_URL }),
  );
}

export async function requestPasswordReset({
  email,
}: ForgotPasswordInput): Promise<void> {
  await unwrap(
    authClient.requestPasswordReset({
      email,
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`,
    }),
  );
}

export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}): Promise<void> {
  await unwrap(authClient.resetPassword({ newPassword: password, token }));
}

export async function signOut(): Promise<void> {
  await unwrap(authClient.signOut());
}

export async function updateProfile({
  name,
  email,
}: ProfileInput): Promise<Session> {
  const { user } = await currentSession();
  await unwrap(authClient.updateUser({ name }));
  if (email !== user.email) {
    await unwrap(authClient.changeEmail({ newEmail: email }));
  }
  return currentSession();
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  await unwrap(
    authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    }),
  );
}

export async function uploadAvatar(file: Blob): Promise<Session> {
  const body = new FormData();
  body.append("file", await squareImage(file, AVATAR_SIZE_PX), "avatar.webp");
  await request("/api/avatars", { body, method: "PUT" });
  return currentSession();
}

export async function removeAvatar(): Promise<Session> {
  await request("/api/avatars", { method: "DELETE" });
  return currentSession();
}

export async function deleteAccount(): Promise<void> {
  await unwrap(authClient.deleteUser());
}
