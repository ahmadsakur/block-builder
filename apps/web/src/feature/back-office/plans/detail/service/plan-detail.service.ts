import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type {
  Entitlements,
  PlanDetail,
  PlanId,
} from "../types/plan-detail.types";

export function getPlan(id: PlanId): Promise<PlanDetail> {
  return api(API.root.plan(id));
}

export function savePlanPermissions(
  id: PlanId,
  entitlements: Entitlements,
): Promise<PlanDetail> {
  return api(API.root.planPermissions(id), {
    json: { entitlements },
    method: "PUT",
  });
}

export function deletePlan(id: PlanId): Promise<void> {
  return api(API.root.plan(id), { method: "DELETE" });
}
