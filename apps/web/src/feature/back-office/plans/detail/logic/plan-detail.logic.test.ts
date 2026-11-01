import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { describe, expect, test } from "vitest";
import {
  changedKeys,
  dependencyHint,
  parseLimit,
  toEntitlements,
  togglePermission,
  toRows,
} from "./plan-detail.logic";

const saved = resolveEntitlements([
  { key: "projects.max", enabled: true, limit: 3 },
  { key: "projects.export", enabled: true, limit: null },
]);

describe("togglePermission", () => {
  test("turning a permission on turns on what it needs", () => {
    const off = resolveEntitlements([
      { key: "projects.max", enabled: false, limit: 3 },
    ]);
    const next = togglePermission(off, "projects.export", true);
    expect(next["projects.export"].enabled).toBe(true);
    expect(next["projects.max"]).toEqual({ enabled: true, limit: 3 });
  });

  test("turning a permission off turns off what needs it", () => {
    const next = togglePermission(saved, "projects.max", false);
    expect(next["projects.max"]).toEqual({ enabled: false, limit: 3 });
    expect(next["projects.export"].enabled).toBe(false);
  });
});

test("changedKeys lists keys whose value moved", () => {
  const draft = {
    ...saved,
    "projects.max": { enabled: true, limit: 10 },
  };
  expect(changedKeys(saved, saved)).toEqual([]);
  expect(changedKeys(saved, draft)).toEqual(["projects.max"]);
});

test("rows round-trip to entitlements", () => {
  expect(toEntitlements(toRows(saved))).toEqual(saved);
});

test("parseLimit treats empty as unlimited", () => {
  expect(parseLimit(" ")).toBeNull();
  expect(parseLimit("12")).toBe(12);
});

test("dependencyHint names the other side of a requirement", () => {
  expect(dependencyHint("projects.export")).toBe("Needs Projects.");
  expect(dependencyHint("projects.max")).toBe(
    "Turning it off also turns off Export projects.",
  );
  expect(dependencyHint("analytics.view")).toBeUndefined();
});
