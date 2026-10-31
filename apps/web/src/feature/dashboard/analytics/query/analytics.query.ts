"use client";

import { useQuery } from "@tanstack/react-query";
import { isAccessError } from "@/lib/api";
import { getAnalytics } from "../service/analytics.service";

const MAX_RETRIES = 3;

export const analyticsKeys = {
  all: ["analytics"] as const,
};

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: analyticsKeys.all,
    queryFn: getAnalytics,
    retry: (failures, error) => !isAccessError(error) && failures < MAX_RETRIES,
  });
}
