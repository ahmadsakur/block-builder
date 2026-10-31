"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planKeys } from "@/feature/back-office/_shared/query/plans.query";
import { updatePlan } from "../service/plans.service";
import type { PlanId, PlanUpdateInput } from "../types/plans.types";

export function useUpdatePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: PlanId; input: PlanUpdateInput }) =>
      updatePlan(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: planKeys.all }),
  });
}
