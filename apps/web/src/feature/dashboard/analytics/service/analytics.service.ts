import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type { AnalyticsSummary } from "../types/analytics.types";

export function getAnalytics(): Promise<AnalyticsSummary> {
  return api<AnalyticsSummary>(API.user.analytics);
}
