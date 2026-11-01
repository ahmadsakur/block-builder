import { expect, test } from "vitest";
import { pluralize } from "./plans.logic";

test("pluralize picks the form for the count", () => {
  expect(pluralize(1, "user")).toBe("1 user");
  expect(pluralize(3, "user")).toBe("3 users");
  expect(pluralize(2, "person", "people")).toBe("2 people");
});
