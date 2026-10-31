import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { describe, expect, test } from "vitest";
import { AccessError, assertAllowed, assertRoom } from "./plans.logic";

const entitlements = resolveEntitlements([
  { key: "projects.max", enabled: true, limit: 3 },
  { key: "analytics.view", enabled: true, limit: null },
]);

function thrown(run: () => void): AccessError | undefined {
  try {
    run();
  } catch (error) {
    if (error instanceof AccessError) return error;
    throw error;
  }
}

describe("assertAllowed", () => {
  test("passes enabled flags", () => {
    expect(thrown(() => assertAllowed(entitlements, "analytics.view"))).toBe(
      undefined,
    );
  });

  test("locks disabled flags with the permission key", () => {
    const error = thrown(() => assertAllowed(entitlements, "projects.export"));
    expect(error?.code).toBe("FEATURE_LOCKED");
    expect(error?.permission).toBe("projects.export");
  });
});

describe("assertRoom", () => {
  test("allows creating below the limit", () => {
    expect(thrown(() => assertRoom(entitlements, "projects.max", 2))).toBe(
      undefined,
    );
  });

  test("names the limit when it is reached", () => {
    const error = thrown(() => assertRoom(entitlements, "projects.max", 3));
    expect(error?.code).toBe("LIMIT_REACHED");
    expect(error?.message).toBe(
      "Your plan allows 3 projects. Upgrade for more.",
    );
  });
});
