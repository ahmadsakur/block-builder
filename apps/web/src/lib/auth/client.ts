import { createAuthClient } from "better-auth/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { env } from "@/env";
import { type AuthError, authErrorMessage } from "./errors";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: { plan: { type: "string", required: true, input: false } },
    }),
  ],
});

export async function unwrap<T>(
  response: Promise<{ data: T | null; error: AuthError | null }>,
): Promise<NonNullable<T>> {
  const { data, error } = await response;
  if (error || !data) throw new Error(authErrorMessage(error ?? {}));
  return data;
}

export async function apiRequest(
  path: string,
  init: RequestInit,
): Promise<void> {
  const response = await fetch(path, init);
  if (response.ok) return;
  const body: AuthError = await response.json().catch(() => ({}));
  throw new Error(authErrorMessage(body));
}
