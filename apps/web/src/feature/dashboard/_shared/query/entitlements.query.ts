"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { featureAllowed, limitState } from "../logic/entitlements.logic";
import { getMyEntitlements, getPlans } from "../service/entitlements.service";
import type { LimitKey, PermissionKey } from "../types/entitlements.types";

export const entitlementKeys = {
  all: ["entitlements"] as const,
  mine: () => [...entitlementKeys.all, "mine"] as const,
  plans: () => [...entitlementKeys.all, "plans"] as const,
};

export function useEntitlementsQuery() {
  return useQuery({
    queryKey: entitlementKeys.mine(),
    queryFn: getMyEntitlements,
  });
}

export function usePlansQuery() {
  return useQuery({ queryKey: entitlementKeys.plans(), queryFn: getPlans });
}

export function useFeature(key: PermissionKey) {
  return featureAllowed(useEntitlementsQuery().data, key);
}

export function useLimit(key: LimitKey) {
  return limitState(useEntitlementsQuery().data, key);
}

export function useInvalidateEntitlements() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: entitlementKeys.all });
}
