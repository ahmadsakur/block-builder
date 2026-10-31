import { expect, test } from "vitest";
import { userListParamsSchema, userListSearchParams } from "./users";

test("search params round-trip through the API parser", () => {
  const query = {
    page: 2,
    pageSize: 25,
    plan: ["pro" as const],
    search: "ana",
    sort: [{ desc: true, id: "createdAt" }],
  };
  const params = Object.fromEntries(userListSearchParams(query));
  expect(userListParamsSchema.parse(params)).toEqual(query);
});

test("defaults missing params and drops unknown sort fields and plans", () => {
  expect(userListParamsSchema.safeParse({ sort: "password.asc" }).data).toEqual(
    { page: 1, pageSize: 10, plan: [], search: "", sort: [] },
  );
  expect(userListParamsSchema.safeParse({ plan: "gold" }).success).toBe(false);
});
