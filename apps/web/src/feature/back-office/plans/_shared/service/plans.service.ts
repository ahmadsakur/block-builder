import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type { Plan, PlanId, PlanInput } from "../types/plans.types";

export function createPlan(input: PlanInput): Promise<Plan> {
  return api(API.root.plans, { json: input, method: "POST" });
}

export function updatePlan(id: PlanId, input: PlanInput): Promise<Plan> {
  return api(API.root.plan(id), { json: input, method: "PATCH" });
}

export function deletePlan(id: PlanId): Promise<void> {
  return api(API.root.plan(id), { method: "DELETE" });
}
