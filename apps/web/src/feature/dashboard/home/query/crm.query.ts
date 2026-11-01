"use client";

import { useQuery } from "@tanstack/react-query";
import { getCrmOverview } from "../service/crm.service";

export const crmKeys = {
  all: ["crm"] as const,
  overview: () => [...crmKeys.all, "overview"] as const,
};

export function useCrmOverviewQuery() {
  return useQuery({ queryKey: crmKeys.overview(), queryFn: getCrmOverview });
}
