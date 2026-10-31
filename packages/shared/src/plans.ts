import { z } from "zod";
import type {
  Entitlements,
  PermissionKey,
  PermissionValue,
  Usage,
} from "./entitlements";

export const PLAN_IDS = ["free", "pro"] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export const DEFAULT_PLAN: PlanId = "free";

export function toPlanId(value: unknown): PlanId {
  return PLAN_IDS.find((plan) => plan === value) ?? DEFAULT_PLAN;
}

export const planIdSchema = z.enum(PLAN_IDS, "Pick a plan.");

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  sort: number;
}

export interface PlanSummary extends Plan {
  userCount: number;
}

export interface PlanWithEntitlements extends Plan {
  entitlements: Entitlements;
}

export const planUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a plan name.")
    .max(40, "Keep it under 40 characters."),
  description: z.string().trim().max(200, "Keep it under 200 characters."),
});
export type PlanUpdateInput = z.infer<typeof planUpdateSchema>;

export interface PlanPermission extends PermissionValue {
  planId: PlanId;
  key: PermissionKey;
}

export interface PermissionMatrix {
  plans: Plan[];
  values: PlanPermission[];
}

export interface MyEntitlements {
  plan: Plan;
  entitlements: Entitlements;
  usage: Usage;
}
