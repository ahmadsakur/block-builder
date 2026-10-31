import type {
  MyEntitlements,
  PlanId,
  PlanWithEntitlements,
} from "../types/entitlements.types";

export const DEMO_PLANS: PlanWithEntitlements[] = [
  {
    description: "For trying things out.",
    entitlements: {
      "analytics.view": { enabled: false, limit: null },
      "projects.export": { enabled: false, limit: null },
      "projects.max": { enabled: true, limit: 3 },
    },
    id: "free",
    name: "Free",
    sort: 0,
  },
  {
    description: "For people who ship every week.",
    entitlements: {
      "analytics.view": { enabled: true, limit: null },
      "projects.export": { enabled: true, limit: null },
      "projects.max": { enabled: true, limit: 25 },
    },
    id: "pro",
    name: "Pro",
    sort: 1,
  },
];

export function demoEntitlements(
  planId: PlanId,
  projects: number,
): MyEntitlements {
  const { entitlements, ...plan } =
    DEMO_PLANS.find((item) => item.id === planId) ?? DEMO_PLANS[0];
  return {
    entitlements: { ...entitlements },
    plan,
    usage: { "projects.max": projects },
  };
}
