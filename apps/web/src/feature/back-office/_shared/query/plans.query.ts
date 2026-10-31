"use client";

import { useQuery } from "@tanstack/react-query";
import { listPlans } from "../service/plans.service";

export const planKeys = {
  all: ["back-office", "plans"] as const,
};

export function usePlansQuery() {
  return useQuery({ queryKey: planKeys.all, queryFn: listPlans });
}
