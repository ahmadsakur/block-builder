import type { User } from "@supabase/supabase-js";
import { expect, test } from "vitest";
import {
  AUTH_FALLBACK_ERROR,
  authErrorMessage,
  toAuthUser,
} from "./auth.logic";

function supabaseUser(overrides: Partial<User> = {}): User {
  return {
    app_metadata: {},
    aud: "authenticated",
    created_at: "2026-10-21T00:00:00Z",
    email: "jane@acme.com",
    id: "user-1",
    user_metadata: { name: "Jane Doe" },
    ...overrides,
  };
}

test("maps known Supabase error codes to our copy", () => {
  expect(
    authErrorMessage({ code: "invalid_credentials", message: "raw" }),
  ).toBe("That email and password don't match.");
  expect(authErrorMessage({ code: "user_already_exists" })).toBe(
    "An account with this email already exists.",
  );
});

test("falls back to the Supabase message, then a generic one", () => {
  expect(authErrorMessage({ code: "unknown", message: "Rate limited" })).toBe(
    "Rate limited",
  );
  expect(authErrorMessage({})).toBe(AUTH_FALLBACK_ERROR);
});

test("maps a Supabase user to AuthUser", () => {
  expect(
    toAuthUser(
      supabaseUser({
        user_metadata: { avatar_url: "https://img/a.png", name: "Jane Doe" },
      }),
    ),
  ).toEqual({
    avatarUrl: "https://img/a.png",
    email: "jane@acme.com",
    id: "user-1",
    name: "Jane Doe",
  });
});

test("uses the email name when the user has no display name", () => {
  expect(toAuthUser(supabaseUser({ user_metadata: {} })).name).toBe("jane");
});
