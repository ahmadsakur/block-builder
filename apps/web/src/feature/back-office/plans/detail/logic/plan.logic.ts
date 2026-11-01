import {
  grantedCount,
  PERMISSION_KEYS,
  PERMISSIONS,
} from "@block-builder/shared/entitlements";
import type { PageHeaderFact } from "@/components/dashboardblocks/page-header";
import { pluralize } from "../../_shared/logic/plans.logic";
import {
  type Entitlements,
  FEATURES,
  type PlanDetail,
} from "../types/plan-detail.types";
import { featureCoverage } from "./permissions.logic";

export function describePlan(plan: PlanDetail) {
  const about = plan.description || "No description yet.";
  const signUps = plan.isDefault ? " New sign-ups join it." : "";
  return `${about}${signUps} Changes apply to everyone on this plan.`;
}

export function limitValue(entitlements: Entitlements, key: string) {
  const value = entitlements[key as keyof Entitlements];
  if (!value?.enabled) return "None";
  return value.limit === null ? "Unlimited" : value.limit.toLocaleString();
}

export function planFacts(
  plan: PlanDetail,
  entitlements: Entitlements,
): PageHeaderFact[] {
  const features = FEATURES.filter(
    (feature) => featureCoverage(feature, entitlements).count > 0,
  ).length;
  const limits = PERMISSIONS.filter(
    (permission) => permission.kind === "limit",
  );

  return [
    {
      detail: plan.members === 0 ? "Nobody is on it yet" : undefined,
      label: "Users",
      value: plan.members,
    },
    {
      detail: `In ${features} of ${pluralize(FEATURES.length, "feature")}`,
      label: "Permissions",
      value: `${grantedCount(entitlements)} of ${PERMISSION_KEYS.length}`,
    },
    ...limits.map((permission) => ({
      detail: "Per user",
      label: permission.label,
      value: limitValue(entitlements, permission.key),
    })),
  ];
}
