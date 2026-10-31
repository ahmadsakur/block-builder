import { expect, test } from "vitest";
import { planName } from "./plans.logic";

const PLANS = [{ description: "", id: "pro" as const, name: "Pro+", sort: 1 }];

test("uses the plan's current name", () => {
  expect(planName(PLANS, "pro")).toBe("Pro+");
});

test("falls back to the capitalised id while plans load", () => {
  expect(planName(undefined, "free")).toBe("Free");
});
