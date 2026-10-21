"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from "nuqs";
import { LIST_URL_KEYS, listQueryParsers } from "@/lib/list-query";
import {
  CUSTOMERS_DEFAULT_SORT,
  CUSTOMERS_PAGE_SIZE,
} from "../data/customers.data";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from "../service/customers.service";
import {
  CUSTOMER_PLANS,
  CUSTOMER_STATUSES,
  type CustomerInput,
  type CustomerListQuery,
} from "../types/customers.types";

const customerListParams = {
  ...listQueryParsers({
    pageSize: CUSTOMERS_PAGE_SIZE,
    sort: CUSTOMERS_DEFAULT_SORT,
  }),
  plan: parseAsArrayOf(parseAsStringLiteral(CUSTOMER_PLANS)).withDefault([]),
  status: parseAsArrayOf(parseAsStringLiteral(CUSTOMER_STATUSES)).withDefault(
    [],
  ),
};

export function useCustomerListParams() {
  return useQueryStates(customerListParams, {
    history: "replace",
    urlKeys: LIST_URL_KEYS,
  });
}

export const customerKeys = {
  all: ["customers"] as const,
  list: (query: CustomerListQuery) =>
    [...customerKeys.all, "list", query] as const,
};

export function useCustomersQuery(query: CustomerListQuery) {
  return useQuery({
    queryKey: customerKeys.list(query),
    queryFn: () => listCustomers(query),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateCustomers() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: customerKeys.all });
}

export function useSaveCustomer() {
  const invalidate = useInvalidateCustomers();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: CustomerInput }) =>
      id ? updateCustomer(id, input) : createCustomer(input),
    onSuccess: invalidate,
  });
}

export function useDeleteCustomer() {
  const invalidate = useInvalidateCustomers();
  return useMutation({ mutationFn: deleteCustomer, onSuccess: invalidate });
}
