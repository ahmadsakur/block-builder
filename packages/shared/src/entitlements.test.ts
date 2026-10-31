import { describe, expect, test } from "vitest";
import {
  DENIED,
  hasRoom,
  isAllowed,
  isPermissionKey,
  limitOf,
  PERMISSION_KEYS,
  permissionValueSchema,
  resolveEntitlements,
} from "./entitlements";

describe("resolveEntitlements", () => {
  test("denies every catalog permission that has no row", () => {
    const entitlements = resolveEntitlements([]);
    expect(Object.keys(entitlements).sort()).toEqual(
      [...PERMISSION_KEYS].sort(),
    );
    for (const key of PERMISSION_KEYS)
      expect(entitlements[key]).toEqual(DENIED);
  });

  test("applies rows and ignores keys the catalog no longer has", () => {
    const entitlements = resolveEntitlements([
      { key: "analytics.view", enabled: true, limit: null },
      { key: "retired.feature", enabled: true, limit: null },
    ]);
    expect(entitlements["analytics.view"]).toEqual({
      enabled: true,
      limit: null,
    });
    expect("retired.feature" in entitlements).toBe(false);
  });
});

describe("checks", () => {
  const entitlements = resolveEntitlements([
    { key: "projects.max", enabled: true, limit: 3 },
    { key: "projects.export", enabled: false, limit: null },
  ]);

  test("isAllowed reads the flag", () => {
    expect(isAllowed(entitlements, "projects.export")).toBe(false);
    expect(isAllowed(entitlements, "projects.max")).toBe(true);
  });

  test("hasRoom stops at the limit", () => {
    expect(hasRoom(entitlements, "projects.max", 2)).toBe(true);
    expect(hasRoom(entitlements, "projects.max", 3)).toBe(false);
  });

  test("a null limit is unlimited and a disabled limit is zero", () => {
    const unlimited = resolveEntitlements([
      { key: "projects.max", enabled: true, limit: null },
    ]);
    expect(limitOf(unlimited, "projects.max")).toBeNull();
    expect(hasRoom(unlimited, "projects.max", 10_000)).toBe(true);

    const off = resolveEntitlements([
      { key: "projects.max", enabled: false, limit: 50 },
    ]);
    expect(limitOf(off, "projects.max")).toBe(0);
    expect(hasRoom(off, "projects.max", 0)).toBe(false);
  });
});

test("isPermissionKey only accepts catalog keys", () => {
  expect(isPermissionKey("projects.max")).toBe(true);
  expect(isPermissionKey("projects")).toBe(false);
});

test("permissionValueSchema rejects negative and fractional limits", () => {
  expect(
    permissionValueSchema.safeParse({ enabled: true, limit: -1 }).success,
  ).toBe(false);
  expect(
    permissionValueSchema.safeParse({ enabled: true, limit: 1.5 }).success,
  ).toBe(false);
  expect(
    permissionValueSchema.safeParse({ enabled: true, limit: null }).success,
  ).toBe(true);
});
