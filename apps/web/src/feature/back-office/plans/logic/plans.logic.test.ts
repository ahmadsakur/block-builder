import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { expect, test } from "vitest";
import { initials, memberLabel, permissionSummary } from "./plans.logic";

test("initials takes the first and last word", () => {
  expect(initials("Jane Mary Doe")).toBe("JD");
  expect(initials(" bo ")).toBe("B");
  expect(initials("  ")).toBe("?");
});

test("permissionSummary counts granted permissions", () => {
  expect(
    permissionSummary(
      resolveEntitlements([
        { key: "analytics.view", enabled: true, limit: null },
      ]),
    ),
  ).toBe("1 of 3");
});

test("memberLabel pluralizes", () => {
  expect(memberLabel(1)).toBe("1 user");
  expect(memberLabel(4)).toBe("4 users");
});
