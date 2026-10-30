import { expect, test } from "vitest";
import { parseSort, serializeSort } from "./list-query";

test("serializes sort rules as id.direction pairs", () => {
  expect(
    serializeSort([
      { desc: false, id: "company" },
      { desc: true, id: "createdAt" },
    ]),
  ).toBe("company.asc,createdAt.desc");
});

test("parses what it serializes and drops empty parts", () => {
  expect(parseSort("company.asc,,createdAt.desc")).toEqual([
    { desc: false, id: "company" },
    { desc: true, id: "createdAt" },
  ]);
  expect(parseSort("")).toEqual([]);
});
