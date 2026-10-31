import type { ManagedUser, UserStatus } from "../types/users.types";

export function userStatus(user: ManagedUser): UserStatus {
  if (user.banned) return "banned";
  return user.emailVerified ? "active" : "unverified";
}
