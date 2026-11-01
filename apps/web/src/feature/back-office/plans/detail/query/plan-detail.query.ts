"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planKeys } from "@/feature/back-office/_shared/query/plans.query";
import { ApiError } from "@/lib/api";
import {
  deletePlan,
  getPlan,
  savePlanPermissions,
} from "../service/plan-detail.service";
import type { Entitlements, PlanId } from "../types/plan-detail.types";

const MAX_RETRIES = 2;

export function usePlanQuery(id: PlanId) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => getPlan(id),
    retry: (failures, error) =>
      !(error instanceof ApiError && error.status === 404) &&
      failures < MAX_RETRIES,
  });
}

export function useSavePlanPermissions(id: PlanId) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (entitlements: Entitlements) =>
      savePlanPermissions(id, entitlements),
    onSuccess: (detail) => {
      client.setQueryData(planKeys.detail(id), detail);
      return client.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}

export function useDeletePlan(id: PlanId) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => deletePlan(id),
    onSuccess: () => {
      client.removeQueries({ queryKey: planKeys.detail(id) });
      return client.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}
