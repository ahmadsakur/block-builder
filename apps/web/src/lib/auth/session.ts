import { type Session, toRole } from "@block-builder/shared/auth";
import { toPlanId } from "@block-builder/shared/plans";
import { authClient, unwrap } from "./client";
import { authErrorMessage } from "./errors";

export function toSession(user: {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string | null;
  plan?: string | null;
}): Session {
  const { id, email, name, image, role, plan } = user;
  return {
    user: {
      email,
      id,
      name,
      role: toRole(role),
      plan: toPlanId(plan),
      ...(image ? { avatarUrl: image } : {}),
    },
  };
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(authErrorMessage(error));
  return data ? toSession(data.user) : null;
}

export async function currentSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("You're signed out. Sign in again.");
  return session;
}

export async function signOut(): Promise<void> {
  await unwrap(authClient.signOut());
}
