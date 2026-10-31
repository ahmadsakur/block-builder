import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type {
  MyEntitlements,
  PlanWithEntitlements,
} from "../types/entitlements.types";

export function getMyEntitlements(): Promise<MyEntitlements> {
  return api<MyEntitlements>(API.user.entitlements);
}

export function getPlans(): Promise<PlanWithEntitlements[]> {
  return api<PlanWithEntitlements[]>(API.user.plans);
}
