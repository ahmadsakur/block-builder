import { limitOf, PERMISSIONS } from "@block-builder/shared/entitlements";
import type { MyEntitlements } from "@/feature/dashboard/_shared/types/entitlements.types";
import type { PlanLimit } from "../types/plan.types";

const NEAR_SHARE = 0.8;

export function planLimits(data: MyEntitlements): PlanLimit[] {
  return PERMISSIONS.flatMap((def) =>
    def.kind === "limit"
      ? [
          {
            key: def.key,
            limit: limitOf(data.entitlements, def.key),
            name: def.label,
            unit: def.unit,
            used: data.usage[def.key],
          },
        ]
      : [],
  );
}

export function atLimit({ limit, used }: PlanLimit): boolean {
  return limit !== null && used >= limit;
}

export function nearLimit({ limit, used }: PlanLimit): boolean {
  return limit !== null && limit > 0 && used / limit >= NEAR_SHARE;
}

export function planSummary(limits: PlanLimit[]): string {
  const full = limits.find(atLimit);
  if (full)
    return `You've used all the ${full.name.toLowerCase()} your plan allows.`;
  const near = limits.find(nearLimit);
  if (near) return `${near.name} are nearly at the limit.`;
  return "Every limit has room.";
}
