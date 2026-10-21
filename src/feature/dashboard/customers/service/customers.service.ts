import { delay } from "@/lib/delay";
import type { ListResult } from "@/lib/list-query";
import { CUSTOMERS } from "../data/customers.data";
import { queryCustomers } from "../logic/customers.logic";
import type { Customer, CustomerListQuery } from "../types/customers.types";

const MOCK_LATENCY_MS = 450;

export async function listCustomers(
  query: CustomerListQuery,
): Promise<ListResult<Customer>> {
  await delay(MOCK_LATENCY_MS);
  return queryCustomers(CUSTOMERS, query);
}
