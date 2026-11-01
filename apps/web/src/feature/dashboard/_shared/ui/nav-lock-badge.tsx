"use client";

import { LockIcon } from "lucide-react";
import { useFeature } from "../query/entitlements.query";
import type { PermissionKey } from "../types/entitlements.types";

export default function NavLockBadge({
  permission,
}: {
  permission: PermissionKey;
}) {
  const allowed = useFeature(permission);
  if (allowed !== false) return null;

  return (
    <span className="text-muted-foreground flex items-center">
      <LockIcon aria-hidden className="size-3.5" />
      <span className="sr-only">Not in your plan</span>
    </span>
  );
}
