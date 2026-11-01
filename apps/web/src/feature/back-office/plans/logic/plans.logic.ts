import {
  type Entitlements,
  grantedCount,
  PERMISSION_KEYS,
} from "@block-builder/shared/entitlements";

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.charAt(0) ?? "";
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function permissionSummary(entitlements: Entitlements): string {
  return `${grantedCount(entitlements)} of ${PERMISSION_KEYS.length}`;
}

export function memberLabel(members: number): string {
  return `${members} ${members === 1 ? "user" : "users"}`;
}
