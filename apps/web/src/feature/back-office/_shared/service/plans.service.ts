import { API } from "@block-builder/shared/api";
import type { PlanRow } from "@block-builder/shared/plans";
import { api } from "@/lib/api";

export function listPlans(): Promise<PlanRow[]> {
  return api(API.root.plans);
}
