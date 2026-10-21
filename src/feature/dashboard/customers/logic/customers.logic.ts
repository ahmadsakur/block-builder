import type { ListResult, SortRule } from "@/lib/list-query";
import type { Customer, CustomerListQuery } from "../types/customers.types";

const SORTABLE: (keyof Customer)[] = [
  "company",
  "mrr",
  "plan",
  "seats",
  "signedUp",
];

const CSV_COLUMNS: (keyof Customer)[] = [
  "id",
  "company",
  "email",
  "status",
  "plan",
  "seats",
  "mrr",
  "signedUp",
];

const FORMULA_START = /^[=+\-@\t\r]/;

function countBy(customers: Customer[], key: "plan" | "status") {
  const counts: Record<string, number> = {};
  for (const customer of customers) {
    counts[customer[key]] = (counts[customer[key]] ?? 0) + 1;
  }
  return counts;
}

function compareBy(rules: SortRule[]) {
  return (a: Customer, b: Customer) => {
    for (const rule of rules) {
      const key = rule.id as keyof Customer;
      if (!SORTABLE.includes(key)) continue;
      const left = a[key];
      const right = b[key];
      const order =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      if (order !== 0) return rule.desc ? -order : order;
    }
    return 0;
  };
}

export function queryCustomers(
  customers: Customer[],
  query: CustomerListQuery,
): ListResult<Customer> {
  const term = query.search.trim().toLowerCase();
  const searched = term
    ? customers.filter(
        (customer) =>
          customer.company.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term),
      )
    : customers;
  const byStatus = (customer: Customer) =>
    query.status.length === 0 || query.status.includes(customer.status);
  const byPlan = (customer: Customer) =>
    query.plan.length === 0 || query.plan.includes(customer.plan);

  const filtered = searched.filter(
    (customer) => byStatus(customer) && byPlan(customer),
  );
  const start = (query.page - 1) * query.pageSize;

  return {
    facets: {
      plan: countBy(searched.filter(byStatus), "plan"),
      status: countBy(searched.filter(byPlan), "status"),
    },
    rows: [...filtered]
      .sort(compareBy(query.sort))
      .slice(start, start + query.pageSize),
    total: filtered.length,
  };
}

function csvCell(value: string | number) {
  const text =
    typeof value === "string" && FORMULA_START.test(value)
      ? `'${value}`
      : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(customers: Customer[]) {
  return [
    CSV_COLUMNS,
    ...customers.map((customer) => CSV_COLUMNS.map((key) => customer[key])),
  ]
    .map((line) => line.map(csvCell).join(","))
    .join("\n");
}
