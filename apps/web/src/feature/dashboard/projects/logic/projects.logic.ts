import type { PermissionKey } from "@/feature/dashboard/_shared/types/entitlements.types";
import { isAccessError } from "@/lib/api";

const CREATED_FORMAT = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function formatCreatedAt(iso: string): string {
  return CREATED_FORMAT.format(new Date(iso));
}

export function upgradeFor(error: unknown): PermissionKey | undefined {
  return isAccessError(error) ? error.body.permission : undefined;
}
