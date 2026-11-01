import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { describe, expect, test } from "vitest";
import { FEATURES } from "../types/plan-detail.types";
import {
  changedPermissions,
  describeRequirement,
  featureCoverage,
  firstLimitError,
  parseLimit,
  setLimit,
  setPermissions,
} from "./permissions.logic";

const none = resolveEntitlements([]);
const projects = FEATURES[0];

describe("setPermissions", () => {
  test("turning one on turns on what it needs", () => {
    const next = setPermissions(none, ["projects.export"], true);
    expect(next["projects.export"].enabled).toBe(true);
    expect(next["projects.max"].enabled).toBe(true);
  });

  test("a limit turned on from nothing starts unlimited", () => {
    const next = setPermissions(none, ["projects.max"], true);
    expect(next["projects.max"]).toEqual({ enabled: true, limit: null });
  });

  test("a limit turned back on keeps its number", () => {
    const off = resolveEntitlements([
      { key: "projects.max", enabled: false, limit: 5 },
    ]);
    expect(setPermissions(off, ["projects.max"], true)["projects.max"]).toEqual(
      { enabled: true, limit: 5 },
    );
  });

  test("turning one off turns off what needs it", () => {
    const all = setPermissions(none, ["projects.export"], true);
    const next = setPermissions(all, ["projects.max"], false);
    expect(next["projects.max"].enabled).toBe(false);
    expect(next["projects.export"].enabled).toBe(false);
  });

  test("leaves the input alone", () => {
    setPermissions(none, ["projects.max"], true);
    expect(none["projects.max"].enabled).toBe(false);
  });
});

test("changedPermissions tracks ticks and limits of granted permissions", () => {
  const saved = setPermissions(none, ["projects.max"], true);
  expect(changedPermissions(saved, saved).size).toBe(0);
  expect([
    ...changedPermissions(setLimit(saved, "projects.max", 3), saved),
  ]).toEqual(["projects.max"]);
  expect([
    ...changedPermissions(setLimit(none, "projects.max", 9), none),
  ]).toEqual([]);
});

test("featureCoverage counts granted permissions in a feature", () => {
  expect(featureCoverage(projects, none)).toEqual({ all: false, count: 0 });
  const all = setPermissions(none, ["projects.export"], true);
  expect(featureCoverage(projects, all)).toEqual({ all: true, count: 2 });
});

test("describeRequirement names what a permission needs", () => {
  expect(describeRequirement("projects.export")).toBe("Needs “Projects”");
  expect(describeRequirement("projects.max")).toBeNull();
});

test("limits must be whole numbers from zero", () => {
  expect(parseLimit("")).toBeNull();
  expect(parseLimit("4")).toBe(4);
  const bad = setLimit(
    setPermissions(none, ["projects.max"], true),
    "projects.max",
    1.5,
  );
  expect(firstLimitError(bad)).toBe("Projects: Use a whole number.");
  expect(firstLimitError(none)).toBeNull();
});
