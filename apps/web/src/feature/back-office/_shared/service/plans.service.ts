import { API } from "@block-builder/shared/api";
import type { PlanSummary } from "@block-builder/shared/plans";
import { api } from "@/lib/api";

export function listPlans(): Promise<PlanSummary[]> {
  return api(API.root.plans);
}
