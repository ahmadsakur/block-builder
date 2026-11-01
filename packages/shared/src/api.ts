import type { AccessErrorCode, PermissionKey } from "./entitlements";

export interface ApiErrorBody {
  message: string;
  code?: AccessErrorCode;
  permission?: PermissionKey;
}

const V1 = "/api/v1";

export const API = {
  root: {
    users: `${V1}/root/users`,
    userPlan: (userId: string) =>
      `${V1}/root/users/${encodeURIComponent(userId)}/plan`,
    plans: `${V1}/root/plans`,
    plan: (planId: string) => `${V1}/root/plans/${encodeURIComponent(planId)}`,
    planPermissions: (planId: string) =>
      `${V1}/root/plans/${encodeURIComponent(planId)}/permissions`,
  },
  user: {
    entitlements: `${V1}/user/entitlements`,
    plans: `${V1}/user/plans`,
    projects: `${V1}/user/projects`,
    project: (projectId: string) =>
      `${V1}/user/projects/${encodeURIComponent(projectId)}`,
    projectsExport: `${V1}/user/projects/export`,
    analytics: `${V1}/user/analytics`,
  },
} as const;
