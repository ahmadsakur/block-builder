import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type { Plan, PlanId, PlanUpdateInput } from "../types/plans.types";

export function updatePlan(id: PlanId, input: PlanUpdateInput): Promise<Plan> {
  return api(API.root.plan(id), { json: input, method: "PATCH" });
}
