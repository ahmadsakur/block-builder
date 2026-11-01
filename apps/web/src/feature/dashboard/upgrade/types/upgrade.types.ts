import type { PermissionKind } from "@block-builder/shared/entitlements";
import type { PermissionKey } from "@/feature/dashboard/_shared/types/entitlements.types";

export type PlanFeature = {
  key: PermissionKey;
  kind: PermissionKind;
  label: string;
  included: boolean;
  value?: string;
};

export type Notice = {
  title: string;
  description: string;
};
