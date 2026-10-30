import { type Role, toRole } from "@block-builder/shared/auth";
import type { Session } from "../types/auth.types";

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

const HOME_BY_ROLE: Record<Role, string> = {
  root: "/dashboard",
  user: "/app",
};

const AUTH_PAGES = ["/sign-in", "/sign-up"];

export function authErrorMessage(error: {
  code?: string;
  message?: string;
}): string {
  return (
    (error.code && ERROR_COPY[error.code]) ||
    error.message ||
    "Something went wrong. Try again."
  );
}

export function toSession(user: {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string | null;
}): Session {
  const { id, email, name, image, role } = user;
  return {
    user: {
      email,
      id,
      name,
      role: toRole(role),
      ...(image ? { avatarUrl: image } : {}),
    },
  };
}

export function homeFor(role: Role): string {
  return HOME_BY_ROLE[role];
}

function areaRole(pathname: string): Role | undefined {
  return (Object.keys(HOME_BY_ROLE) as Role[]).find((role) => {
    const home = HOME_BY_ROLE[role];
    return pathname === home || pathname.startsWith(`${home}/`);
  });
}

export function proxyRedirect(
  pathname: string,
  role: Role | null,
): string | null {
  const area = areaRole(pathname);
  if (!area) {
    return role && AUTH_PAGES.includes(pathname) ? homeFor(role) : null;
  }
  if (!role) return "/sign-in";
  return role === area ? null : homeFor(role);
}
