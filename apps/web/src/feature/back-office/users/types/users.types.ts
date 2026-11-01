export type { Plan, PlanId } from "@block-builder/shared/plans";
export {
  type ManagedUser,
  type UserListQuery,
  type UserPlanInput,
  userPlanSchema,
} from "@block-builder/shared/users";

export const USER_STATUSES = ["active", "unverified", "banned"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  banned: "Banned",
  unverified: "Unverified",
};
