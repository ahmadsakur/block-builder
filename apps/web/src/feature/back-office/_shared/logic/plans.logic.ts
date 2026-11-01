import type { Plan, PlanId } from "@block-builder/shared/plans";

export function planName(plans: readonly Plan[] | undefined, id: PlanId) {
  return (
    plans?.find((plan) => plan.id === id)?.name ??
    `${id.charAt(0).toUpperCase()}${id.slice(1)}`
  );
}
