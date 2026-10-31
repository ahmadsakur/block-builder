export type {
  Entitlements,
  FlagKey,
  LimitKey,
  PermissionKey,
  PermissionValue,
} from "@block-builder/shared/entitlements";
export type {
  MyEntitlements,
  Plan,
  PlanId,
  PlanWithEntitlements,
} from "@block-builder/shared/plans";

export type LimitState = {
  limit: number | null;
  used: number;
  hasRoom: boolean;
};
