"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planKeys } from "@/feature/back-office/_shared/query/plans.query";
import { createPlan, deletePlan, updatePlan } from "../service/plans.service";
import type { PlanId, PlanInput } from "../types/plans.types";

export function useSavePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: PlanId; input: PlanInput }) =>
      id ? updatePlan(id, input) : createPlan(input),
    onSuccess: () => client.invalidateQueries({ queryKey: planKeys.all }),
  });
}

export function useDeletePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: PlanId) => deletePlan(id),
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: planKeys.detail(id) });
      return client.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}
