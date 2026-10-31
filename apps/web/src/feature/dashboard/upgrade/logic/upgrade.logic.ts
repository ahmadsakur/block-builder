import {
  type Entitlements,
  isAllowed,
  limitOf,
  PERMISSIONS,
  permissionDef,
} from "@block-builder/shared/entitlements";
import {
  formatLimit,
  lockedCopy,
} from "@/feature/dashboard/_shared/logic/entitlements.logic";
import type {
  PermissionKey,
  PlanId,
  PlanWithEntitlements,
} from "@/feature/dashboard/_shared/types/entitlements.types";
import { formatNumber } from "@/lib/dashboardblocks/format";
import type { Notice, PlanFeature } from "../types/upgrade.types";

export function sortPlans(
  plans: PlanWithEntitlements[],
): PlanWithEntitlements[] {
  return [...plans].sort((a, b) => a.sort - b.sort);
}

export function planFeatures(plan: PlanWithEntitlements): PlanFeature[] {
  return PERMISSIONS.map((def) => {
    if (def.kind === "flag") {
      return {
        included: isAllowed(plan.entitlements, def.key),
        key: def.key,
        kind: def.kind,
        label: def.label,
      };
    }
    const limit = limitOf(plan.entitlements, def.key);
    return {
      included: limit !== 0,
      key: def.key,
      kind: def.kind,
      label: def.label,
      value: formatLimit(limit),
    };
  });
}

function allowance(entitlements: Entitlements, key: PermissionKey): number {
  const { enabled, limit } = entitlements[key];
  if (!enabled) return 0;
  if (permissionDef(key).kind === "flag" || limit === null) {
    return Number.POSITIVE_INFINITY;
  }
  return limit;
}

export function planFor(
  plans: PlanWithEntitlements[],
  currentId: PlanId | undefined,
  key: PermissionKey,
): PlanWithEntitlements | undefined {
  const current = plans.find((plan) => plan.id === currentId);
  const floor = current ? allowance(current.entitlements, key) : 0;
  return sortPlans(plans).find(
    (plan) =>
      plan.id !== currentId && allowance(plan.entitlements, key) > floor,
  );
}

export function lockedNotice(
  plans: PlanWithEntitlements[],
  currentId: PlanId | undefined,
  key: PermissionKey,
): Notice {
  const def = permissionDef(key);
  const current = plans.find((plan) => plan.id === currentId);
  if (def.kind === "flag" && current && isAllowed(current.entitlements, key)) {
    return {
      description: "Your plan changed, so you can go straight back to it.",
      title: `${def.label} is included in your plan`,
    };
  }

  const { title } = lockedCopy(key, current?.name);
  const better = planFor(plans, currentId, key);
  if (!better) {
    return {
      description: "No plan offers more yet. Ask an admin if you need it.",
      title,
    };
  }

  const ask = `Ask an admin to move you to ${better.name}.`;
  if (def.kind === "flag") {
    return { description: `It's included in ${better.name}. ${ask}`, title };
  }
  const value = allowance(better.entitlements, key);
  const allowed = Number.isFinite(value) ? formatNumber(value) : "unlimited";
  const unit = def.unit ?? def.label.toLowerCase();
  return {
    description: `${better.name} allows ${allowed} ${unit}. ${ask}`,
    title,
  };
}
