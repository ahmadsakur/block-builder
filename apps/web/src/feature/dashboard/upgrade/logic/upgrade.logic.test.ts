import { describe, expect, test } from "vitest";
import { DEMO_PLANS } from "@/feature/dashboard/_shared/data/plans.data";
import type { PlanWithEntitlements } from "@/feature/dashboard/_shared/types/entitlements.types";
import {
  lockedNotice,
  planFeatures,
  planFor,
  sortPlans,
} from "./upgrade.logic";

const [FREE, PRO] = DEMO_PLANS;

describe("planFeatures", () => {
  test("lists every catalog permission: flags as included or not, limits as values", () => {
    expect(planFeatures(FREE)).toEqual([
      {
        included: true,
        key: "projects.max",
        kind: "limit",
        label: "Projects",
        value: "3",
      },
      {
        included: false,
        key: "projects.export",
        kind: "flag",
        label: "Export projects",
      },
      {
        included: false,
        key: "analytics.view",
        kind: "flag",
        label: "Analytics page",
      },
    ]);
  });

  test("an unlimited limit reads Unlimited and a disabled one reads 0", () => {
    const unlimited: PlanWithEntitlements = {
      ...PRO,
      entitlements: {
        ...PRO.entitlements,
        "projects.max": { enabled: true, limit: null },
      },
    };
    expect(planFeatures(unlimited)[0]).toMatchObject({
      included: true,
      value: "Unlimited",
    });
    const none: PlanWithEntitlements = {
      ...FREE,
      entitlements: {
        ...FREE.entitlements,
        "projects.max": { enabled: false, limit: 3 },
      },
    };
    expect(planFeatures(none)[0]).toMatchObject({
      included: false,
      value: "0",
    });
  });
});

test("sortPlans orders by the plan's sort value", () => {
  expect(sortPlans([PRO, FREE]).map((plan) => plan.id)).toEqual([
    "free",
    "pro",
  ]);
});

describe("planFor", () => {
  test("finds the first plan that unlocks a flag", () => {
    expect(planFor(DEMO_PLANS, "free", "analytics.view")?.id).toBe("pro");
  });

  test("finds a plan with a higher limit", () => {
    expect(planFor(DEMO_PLANS, "free", "projects.max")?.id).toBe("pro");
  });

  test("returns nothing when no other plan does better", () => {
    expect(planFor(DEMO_PLANS, "pro", "projects.max")).toBeUndefined();
  });
});

describe("lockedNotice", () => {
  test("names the locked feature and the plan that includes it", () => {
    expect(lockedNotice(DEMO_PLANS, "free", "analytics.view")).toEqual({
      description: "It's included in Pro. Ask an admin to move you to Pro.",
      title: "Analytics page is locked",
    });
  });

  test("says how much more a bigger plan allows", () => {
    expect(lockedNotice(DEMO_PLANS, "free", "projects.max")).toEqual({
      description: "Pro allows 25 projects. Ask an admin to move you to Pro.",
      title: "Projects limit reached",
    });
  });

  test("tells a user whose plan now includes the feature", () => {
    expect(lockedNotice(DEMO_PLANS, "pro", "analytics.view").title).toBe(
      "Analytics page is included in your plan",
    );
  });

  test("admits when no plan offers more", () => {
    expect(lockedNotice(DEMO_PLANS, "pro", "projects.max").description).toBe(
      "No plan offers more yet. Ask an admin if you need it.",
    );
  });
});
