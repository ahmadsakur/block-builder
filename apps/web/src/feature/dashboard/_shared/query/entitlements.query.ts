"use client";

import {
  type UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useHydrated } from "@/hooks/use-hydrated";
import { featureAllowed, limitState } from "../logic/entitlements.logic";
import { getMyEntitlements, getPlans } from "../service/entitlements.service";
import type {
  LimitKey,
  MyEntitlements,
  PermissionKey,
} from "../types/entitlements.types";

export const entitlementKeys = {
  all: ["entitlements"] as const,
  mine: () => [...entitlementKeys.all, "mine"] as const,
  plans: () => [...entitlementKeys.all, "plans"] as const,
};

type EntitlementsQuery = Pick<
  UseQueryResult<MyEntitlements>,
  "data" | "isError" | "isPending" | "refetch"
>;

export function useEntitlementsQuery(): EntitlementsQuery {
  const hydrated = useHydrated();
  const query = useQuery({
    queryKey: entitlementKeys.mine(),
    queryFn: getMyEntitlements,
  });
  if (hydrated) return query;
  return {
    data: undefined,
    isError: false,
    isPending: true,
    refetch: query.refetch,
  };
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
