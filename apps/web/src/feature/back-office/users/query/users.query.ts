"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from "nuqs";
import { planKeys } from "@/feature/back-office/_shared/query/plans.query";
import { LIST_URL_KEYS, listQueryParsers } from "@/lib/list-query";
import { USERS_DEFAULT_SORT, USERS_PAGE_SIZE } from "../data/users.data";
import { listUsers, setUserPlan } from "../service/users.service";
import {
  PLAN_IDS,
  type UserListQuery,
  type UserPlanInput,
} from "../types/users.types";

const userListParams = {
  ...listQueryParsers({ pageSize: USERS_PAGE_SIZE, sort: USERS_DEFAULT_SORT }),
  plan: parseAsArrayOf(parseAsStringLiteral(PLAN_IDS)).withDefault([]),
};

export function useUserListParams() {
  return useQueryStates(userListParams, {
    history: "replace",
    urlKeys: LIST_URL_KEYS,
  });
}

export const userKeys = {
  all: ["back-office", "users"] as const,
  list: (query: UserListQuery) => [...userKeys.all, "list", query] as const,
};

export function useUsersQuery(query: UserListQuery) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => listUsers(query),
    placeholderData: keepPreviousData,
  });
}

export function useSetUserPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserPlanInput }) =>
      setUserPlan(id, input),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: userKeys.all }),
        client.invalidateQueries({ queryKey: planKeys.all }),
      ]),
  });
}
