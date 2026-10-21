import type { User } from "@supabase/supabase-js";
import type { AuthUser } from "../types/auth.types";

export const AUTH_FALLBACK_ERROR = "Something went wrong. Try again.";
export const SIGNED_OUT_ERROR = "You're signed out. Sign in again.";
export const WRONG_CURRENT_PASSWORD = "Your current password is incorrect.";
export const CONFIRM_EMAIL_FIRST =
  "Check your email to confirm your account, then sign in.";

const RESET_LINK_EXPIRED =
  "This reset link has expired or was opened in another browser. Ask for a new one.";
const ACCOUNT_EXISTS = "An account with this email already exists.";
const TOO_MANY = "Too many attempts. Try again in a few minutes.";

const AUTH_ERROR_COPY: Record<string, string> = {
  bad_code_verifier: RESET_LINK_EXPIRED,
  email_exists: ACCOUNT_EXISTS,
  flow_state_expired: RESET_LINK_EXPIRED,
  flow_state_not_found: RESET_LINK_EXPIRED,
  invalid_credentials: "That email and password don't match.",
  otp_expired: RESET_LINK_EXPIRED,
  over_email_send_rate_limit: TOO_MANY,
  over_request_rate_limit: TOO_MANY,
  same_password: "Use a password you haven't used here before.",
  session_not_found: SIGNED_OUT_ERROR,
  user_already_exists: ACCOUNT_EXISTS,
  weak_password: "Choose a stronger password.",
};

export function authErrorMessage(error: {
  code?: string;
  message?: string;
}): string {
  return (
    (error.code && AUTH_ERROR_COPY[error.code]) ||
    error.message ||
    AUTH_FALLBACK_ERROR
  );
}

export function toAuthUser(user: User): AuthUser {
  const metadata: Record<string, unknown> = user.user_metadata ?? {};
  const email = user.email ?? "";
  const name =
    typeof metadata.name === "string" && metadata.name
      ? metadata.name
      : email.split("@")[0];
  const avatarUrl =
    typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined;
  return { avatarUrl, email, id: user.id, name };
}
