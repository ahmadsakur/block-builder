import {
  hasRoom,
  isAllowed,
  limitOf,
  permissionDef,
} from "@block-builder/shared/entitlements";
import { formatNumber } from "@/lib/dashboardblocks/format";
import type {
  LimitKey,
  LimitState,
  MyEntitlements,
  PermissionKey,
} from "../types/entitlements.types";

export function featureAllowed(
  data: MyEntitlements | undefined,
  key: PermissionKey,
): boolean | undefined {
  return data ? isAllowed(data.entitlements, key) : undefined;
}

export function limitState(
  data: MyEntitlements | undefined,
  key: LimitKey,
): LimitState | undefined {
  if (!data) return undefined;
  const used = data.usage[key];
  return {
    hasRoom: hasRoom(data.entitlements, key, used),
    limit: limitOf(data.entitlements, key),
    used,
  };
}

export function formatLimit(limit: number | null): string {
  return limit === null ? "Unlimited" : formatNumber(limit);
}

export function usageLabel(key: LimitKey, { limit, used }: LimitState) {
  const unit = permissionDef(key).unit ?? "";
  const of = limit === null ? "unlimited" : formatNumber(limit);
  return `${formatNumber(used)} of ${of} ${unit}`.trim();
}

export function lockedCopy(key: PermissionKey, planName?: string) {
  const def = permissionDef(key);
  const plan = planName ? `your ${planName} plan` : "your plan";
  return def.kind === "limit"
    ? {
        description: `You've used everything ${plan} allows. A bigger plan raises the limit.`,
        title: `${def.label} limit reached`,
      }
    : {
        description: `${def.description} It isn't included in ${plan}.`,
        title: `${def.label} is locked`,
      };
}
