import type {
  PermissionKey,
  PermissionValue,
} from "@block-builder/shared/entitlements";
import type { Plan, PlanId } from "@block-builder/shared/plans";

export const DEFAULT_PLANS: Plan[] = [
  {
    description: "For trying things out.",
    id: "free",
    name: "Free",
    sort: 0,
  },
  {
    description: "For people who ship every week.",
    id: "pro",
    name: "Pro",
    sort: 1,
  },
];

export const DEFAULT_PERMISSIONS: Record<
  PlanId,
  Record<PermissionKey, PermissionValue>
> = {
  free: {
    "analytics.view": { enabled: false, limit: null },
    "projects.export": { enabled: false, limit: null },
    "projects.max": { enabled: true, limit: 3 },
  },
  pro: {
    "analytics.view": { enabled: true, limit: null },
    "projects.export": { enabled: true, limit: null },
    "projects.max": { enabled: true, limit: 25 },
  },
};
