import { delay } from "@/lib/delay";
import { DEMO_USER, TAKEN_EMAIL, WRONG_PASSWORD } from "../data/auth.data";
import type {
  AuthUser,
  ChangePasswordInput,
  ForgotPasswordInput,
  ProfileInput,
  Session,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

const MOCK_LATENCY_MS = 700;

let session: Session | null = { user: DEMO_USER };

export async function getSession(): Promise<Session | null> {
  await delay(MOCK_LATENCY_MS);
  return session;
}

export async function signIn({
  email,
  password,
}: SignInInput): Promise<Session> {
  await delay(MOCK_LATENCY_MS);
  if (password === WRONG_PASSWORD) {
    throw new Error("That email and password don't match.");
  }
  session = { user: { ...DEMO_USER, email } };
  return session;
}

export async function signUp({ name, email }: SignUpInput): Promise<Session> {
  await delay(MOCK_LATENCY_MS);
  if (email === TAKEN_EMAIL) {
    throw new Error("An account with this email already exists.");
  }
  session = { user: { email, id: `user-${email}`, name } };
  return session;
}

export async function requestPasswordReset(
  _input: ForgotPasswordInput,
): Promise<void> {
  await delay(MOCK_LATENCY_MS);
}

export async function resetPassword(_input: {
  token: string;
  password: string;
}): Promise<void> {
  await delay(MOCK_LATENCY_MS);
}

export async function signOut(): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  session = null;
}

function currentUser(): AuthUser {
  if (!session) throw new Error("You're signed out. Sign in again.");
  return session.user;
}

export async function updateProfile(input: ProfileInput): Promise<Session> {
  await delay(MOCK_LATENCY_MS);
  const user = currentUser();
  if (input.email === TAKEN_EMAIL) {
    throw new Error("An account with this email already exists.");
  }
  session = { user: { ...user, ...input } };
  return session;
}

export async function changePassword({
  currentPassword,
}: ChangePasswordInput): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  currentUser();
  if (currentPassword === WRONG_PASSWORD) {
    throw new Error("Your current password is incorrect.");
  }
}

export async function deleteAccount(): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  currentUser();
  session = null;
}
