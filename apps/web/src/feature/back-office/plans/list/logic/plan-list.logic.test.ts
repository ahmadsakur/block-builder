import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { describe, expect, test } from "vitest";
import type { PlanRow } from "../../_shared/types/plans.types";
import {
  describePlans,
  describeReach,
  grantedOf,
  othersLabel,
} from "./plan-list.logic";

function row(patch: Partial<PlanRow>): PlanRow {
  return {
    description: "",
    entitlements: resolveEntitlements([]),
    faces: [],
    id: "free",
    isDefault: true,
    members: 0,
    name: "Free",
    sort: 0,
    ...patch,
  };
}

test("describePlans sums users across plans", () => {
  expect(describePlans([row({ members: 2 }), row({ members: 1 })])).toBe(
    "2 plans with 3 users. Open one to choose what it includes.",
  );
});

describe("describeReach", () => {
  test("names the features a plan reaches", () => {
    const plan = row({
      entitlements: resolveEntitlements([
        { key: "projects.max", enabled: true, limit: 3 },
        { key: "analytics.view", enabled: true, limit: null },
      ]),
    });
    expect(describeReach(plan)).toBe("Projects and Analytics");
    expect(grantedOf(plan)).toBe(2);
  });

  test("says so when a plan includes nothing", () => {
    expect(describeReach(row({}))).toBe("Nothing yet");
  });
});

test("othersLabel counts members past the faces, capped", () => {
  const face = { id: "u1", name: "Ana" };
  expect(othersLabel(row({ faces: [face], members: 1 }))).toBeNull();
  expect(othersLabel(row({ faces: [face], members: 4 }))).toBe("+3");
  expect(othersLabel(row({ faces: [face], members: 500 }))).toBe("+99");
});
