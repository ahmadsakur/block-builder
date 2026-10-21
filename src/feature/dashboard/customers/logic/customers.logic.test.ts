import { describe, expect, test } from "vitest";
import { CUSTOMERS } from "../data/customers.data";
import type { CustomerListQuery } from "../types/customers.types";
import { queryCustomers, toCsv } from "./customers.logic";

const QUERY: CustomerListQuery = {
  page: 1,
  pageSize: 10,
  plan: [],
  search: "",
  sort: [{ desc: true, id: "mrr" }],
  status: [],
};

describe("queryCustomers", () => {
  test("pages through every row", () => {
    const first = queryCustomers(CUSTOMERS, QUERY);
    expect(first.rows).toHaveLength(10);
    expect(first.total).toBe(CUSTOMERS.length);
  });

  test("sorts before paging", () => {
    const { rows } = queryCustomers(CUSTOMERS, QUERY);
    const top = Math.max(...CUSTOMERS.map((customer) => customer.mrr));
    expect(rows[0].mrr).toBe(top);
  });

  test("searches company and email", () => {
    const { rows, total } = queryCustomers(CUSTOMERS, {
      ...QUERY,
      search: "northwind",
    });
    expect(total).toBe(5);
    expect(rows.every((row) => row.company.startsWith("Northwind"))).toBe(true);
  });

  test("filters and counts facets without their own filter", () => {
    const result = queryCustomers(CUSTOMERS, { ...QUERY, status: ["trial"] });
    expect(result.rows.every((row) => row.status === "trial")).toBe(true);
    expect(result.facets?.status.active).toBeGreaterThan(0);
  });
});

test("csv escapes formulas and quotes", () => {
  const csv = toCsv([{ ...CUSTOMERS[0], company: '=HYPERLINK("x")' }]);
  expect(csv.split("\n")[1]).toContain(`"'=HYPERLINK(""x"")"`);
});
