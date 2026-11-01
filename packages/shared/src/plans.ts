import { z } from "zod";
import {
  type Entitlements,
  entitlementsSchema,
  type Usage,
} from "./entitlements";

export type PlanId = string;
export const DEFAULT_PLAN: PlanId = "free";

export function toPlanId(value: unknown): PlanId {
  return typeof value === "string" && value.length > 0 ? value : DEFAULT_PLAN;
}

export const planIdSchema = z
  .string("Pick a plan.")
  .regex(/^[a-z0-9][a-z0-9-]{0,39}$/, "Pick a plan.");

export function planSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
    .replace(/-+$/, "");
  return slug || "plan";
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  sort: number;
  isDefault: boolean;
}

export interface PlanPerson {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface PlanRow extends Plan {
  members: number;
  faces: PlanPerson[];
  entitlements: Entitlements;
}

export interface PlanDetail extends Plan {
  members: number;
  entitlements: Entitlements;
}

export interface PlanWithEntitlements extends Plan {
  entitlements: Entitlements;
}

export const planInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a plan name.")
    .max(40, "Keep it under 40 characters."),
  description: z.string().trim().max(160, "Keep it under 160 characters."),
});
export type PlanInput = z.infer<typeof planInputSchema>;

export const planPermissionsSchema = z.object({
  entitlements: entitlementsSchema,
});
export type PlanPermissionsInput = z.infer<typeof planPermissionsSchema>;

export interface MyEntitlements {
  plan: Plan;
  entitlements: Entitlements;
  usage: Usage;
}
