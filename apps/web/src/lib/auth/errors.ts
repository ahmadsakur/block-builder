export type AuthError = { code?: string; message?: string };

const ERROR_COPY: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "That email and password don't match.",
  USER_ALREADY_EXISTS: "An account with this email already exists.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "An account with this email already exists.",
  INVALID_PASSWORD: "Your current password is incorrect.",
  INVALID_TOKEN:
    "This reset link is invalid or has expired. Request a new one.",
  TOKEN_EXPIRED:
    "This reset link is invalid or has expired. Request a new one.",
  SESSION_EXPIRED: "For your security, sign in again and retry.",
  EMAIL_NOT_VERIFIED: "Verify your email first. We just sent you a new link.",
};

export function authErrorMessage(error: AuthError): string {
  return (
    (error.code && ERROR_COPY[error.code]) ||
    error.message ||
    "Something went wrong. Try again."
  );
}
