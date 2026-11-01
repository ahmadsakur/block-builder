"use client";

import { ProBadge } from "@/components/_common/pro-lock";
import { useFeature } from "../query/entitlements.query";
import type { PermissionKey } from "../types/entitlements.types";

export default function NavLockBadge({
  permission,
}: {
  permission: PermissionKey;
}) {
  const allowed = useFeature(permission);
  if (allowed !== false) return null;

  return <ProBadge />;
}
