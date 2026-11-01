import { describe, expect, test } from "vitest";
import { demoEntitlements } from "../data/plans.data";
import {
  featureAllowed,
  formatLimit,
  limitState,
  lockedCopy,
  usageLabel,
} from "./entitlements.logic";

describe("featureAllowed", () => {
  test("is unknown until entitlements load", () => {
    expect(featureAllowed(undefined, "analytics.view")).toBeUndefined();
  });

  test("reads the plan's flag", () => {
    expect(featureAllowed(demoEntitlements("free", 0), "analytics.view")).toBe(
      false,
    );
    expect(featureAllowed(demoEntitlements("pro", 0), "analytics.view")).toBe(
      true,
    );
  });
});

describe("limitState", () => {
  test("has room below the limit", () => {
    expect(limitState(demoEntitlements("free", 2), "projects.max")).toEqual({
      hasRoom: true,
      limit: 3,
      used: 2,
    });
  });

  test("is full at the limit", () => {
    expect(
      limitState(demoEntitlements("free", 3), "projects.max")?.hasRoom,
    ).toBe(false);
  });

  test("a disabled limit allows nothing and null means unlimited", () => {
    const data = demoEntitlements("free", 0);
    data.entitlements["projects.max"] = { enabled: false, limit: 10 };
    expect(limitState(data, "projects.max")).toEqual({
      hasRoom: false,
      limit: 0,
      used: 0,
    });
    data.entitlements["projects.max"] = { enabled: true, limit: null };
    expect(limitState(data, "projects.max")?.hasRoom).toBe(true);
  });
});

test("usageLabel and formatLimit describe limits in words", () => {
  expect(usageLabel("projects.max", { hasRoom: true, limit: 3, used: 2 })).toBe(
    "2 of 3 projects",
  );
  expect(
    usageLabel("projects.max", { hasRoom: true, limit: null, used: 4 }),
  ).toBe("4 projects, no limit");
  expect(formatLimit(null)).toBe("Unlimited");
  expect(formatLimit(25)).toBe("25");
});

test("lockedCopy names the feature and the plan", () => {
  expect(lockedCopy("analytics.view", "Free")).toEqual({
    description:
      "Open the analytics page. It isn't included in your Free plan.",
    title: "Analytics page is locked",
  });
  expect(lockedCopy("projects.max").title).toBe("Projects limit reached");
});
