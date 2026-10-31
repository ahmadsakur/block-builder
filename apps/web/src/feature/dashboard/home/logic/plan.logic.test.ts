import { expect, test } from "vitest";
import { demoEntitlements } from "@/feature/dashboard/_shared/data/plans.data";
import { planLimits, planSummary } from "./plan.logic";

test("planLimits lists each limit with its usage", () => {
  expect(planLimits(demoEntitlements("free", 2))).toEqual([
    {
      key: "projects.max",
      limit: 3,
      name: "Projects",
      unit: "projects",
      used: 2,
    },
  ]);
});

test("planSummary calls out a full or nearly full limit", () => {
  expect(planSummary(planLimits(demoEntitlements("free", 3)))).toBe(
    "You've used all the projects your plan allows.",
  );
  expect(planSummary(planLimits(demoEntitlements("pro", 21)))).toBe(
    "Projects are nearly at the limit.",
  );
  expect(planSummary(planLimits(demoEntitlements("pro", 4)))).toBe(
    "Every limit has room.",
  );
});
