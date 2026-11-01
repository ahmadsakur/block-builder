"use client";

import type { PlanId } from "@block-builder/shared/plans";
import { useQuery } from "@tanstack/react-query";
import { listPlans } from "../service/plans.service";

export const planKeys = {
  all: ["back-office", "plans"] as const,
  list: () => [...planKeys.all, "list"] as const,
  detail: (id: PlanId) => [...planKeys.all, "detail", id] as const,
};

export function usePlansQuery() {
  return useQuery({ queryKey: planKeys.list(), queryFn: listPlans });
}
