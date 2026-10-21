"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from "nuqs";
import { LIST_URL_KEYS, listQueryParsers } from "@/lib/list-query";
import {
  CUSTOMERS_DEFAULT_SORT,
  CUSTOMERS_PAGE_SIZE,
} from "../data/customers.data";
import { listCustomers } from "../service/customers.service";
import {
  CUSTOMER_PLANS,
  CUSTOMER_STATUSES,
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
