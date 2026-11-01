import {
  type Entitlements,
  FEATURES,
  grantedCount,
} from "@block-builder/shared/entitlements";
import { pluralize } from "../../_shared/logic/plans.logic";
import type { PlanRow } from "../../_shared/types/plans.types";

const MAX_OTHERS = 99;
const listFormat = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
});

export function describePlans(plans: PlanRow[]) {
  const people = plans.reduce((sum, plan) => sum + plan.members, 0);
  return `${pluralize(plans.length, "plan")} with ${pluralize(people, "user")}. Open one to choose what it includes.`;
}

export function reachedFeatures(entitlements: Entitlements): string[] {
  return FEATURES.filter((feature) =>
    feature.permissions.some(
      (permission) => entitlements[permission.key].enabled,
    ),
  ).map((feature) => feature.label);
}

export function describeReach(plan: PlanRow) {
  const features = reachedFeatures(plan.entitlements);
  return features.length === 0 ? "Nothing yet" : listFormat.format(features);
}

export function grantedOf(plan: PlanRow) {
  return grantedCount(plan.entitlements);
}

export function othersLabel(plan: PlanRow) {
  const others = plan.members - plan.faces.length;
  if (others <= 0) return null;
  return others > MAX_OTHERS ? `+${MAX_OTHERS}` : `+${others}`;
}
