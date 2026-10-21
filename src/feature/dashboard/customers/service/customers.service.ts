import { delay } from "@/lib/delay";
import type { ListResult } from "@/lib/list-query";
import { CUSTOMERS } from "../data/customers.data";
import {
  customerMrr,
  isEmailTaken,
  queryCustomers,
} from "../logic/customers.logic";
import type {
  Customer,
  CustomerInput,
  CustomerListQuery,
} from "../types/customers.types";

const MOCK_LATENCY_MS = 450;
const EMAIL_TAKEN = "Another customer already uses this billing email.";

let customers = CUSTOMERS;

export async function listCustomers(
  query: CustomerListQuery,
): Promise<ListResult<Customer>> {
  await delay(MOCK_LATENCY_MS);
  return queryCustomers(customers, query);
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  await delay(MOCK_LATENCY_MS);
  if (isEmailTaken(customers, input.email)) throw new Error(EMAIL_TAKEN);
  const customer: Customer = {
    ...input,
    id: `cus_${Date.now().toString(36)}`,
    mrr: customerMrr(input),
    signedUp: new Date().toISOString().slice(0, 10),
  };
  customers = [customer, ...customers];
  return customer;
}

export async function updateCustomer(
  id: string,
  input: CustomerInput,
): Promise<Customer> {
  await delay(MOCK_LATENCY_MS);
  const current = customers.find((customer) => customer.id === id);
  if (!current) throw new Error("This customer no longer exists.");
  if (isEmailTaken(customers, input.email, id)) throw new Error(EMAIL_TAKEN);
  const updated: Customer = { ...current, ...input, mrr: customerMrr(input) };
  customers = customers.map((customer) =>
    customer.id === id ? updated : customer,
  );
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  customers = customers.filter((customer) => customer.id !== id);
}
