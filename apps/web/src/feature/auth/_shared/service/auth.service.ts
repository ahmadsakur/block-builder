import { env } from "@/env";
import { authClient, unwrap } from "@/lib/auth/client";
import { homeFor } from "@/lib/auth/routes";
import { toSession } from "@/lib/auth/session";
import type {
  ForgotPasswordInput,
  Session,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

const VERIFIED_URL = `${env.NEXT_PUBLIC_APP_URL}${homeFor("user")}`;

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
