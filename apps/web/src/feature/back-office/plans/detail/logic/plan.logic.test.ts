import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { expect, test } from "vitest";
import type { PlanDetail } from "../types/plan-detail.types";
import { describePlan, planFacts } from "./plan.logic";

const plan: PlanDetail = {
  description: "For small teams.",
  entitlements: resolveEntitlements([]),
  id: "team",
  isDefault: false,
  members: 0,
  name: "Team",
  sort: 2,
};

test("describePlan mentions sign-ups only for the default plan", () => {
  expect(describePlan(plan)).toBe(
    "For small teams. Changes apply to everyone on this plan.",
  );
  expect(describePlan({ ...plan, description: "", isDefault: true })).toBe(
    "No description yet. New sign-ups join it. Changes apply to everyone on this plan.",
  );
});

test("planFacts follow the ticks on screen", () => {
  const facts = planFacts(
    plan,
    resolveEntitlements([
      { key: "projects.max", enabled: true, limit: 25 },
      { key: "analytics.view", enabled: true, limit: null },
    ]),
  );
  expect(facts).toEqual([
    { detail: "Nobody is on it yet", label: "Users", value: 0 },
    { detail: "In 2 of 2 features", label: "Permissions", value: "2 of 3" },
    { detail: "Per user", label: "Projects", value: "25" },
  ]);
  expect(planFacts(plan, plan.entitlements)[2]?.value).toBe("None");
});
