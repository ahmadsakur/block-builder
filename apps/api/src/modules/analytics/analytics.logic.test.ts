import { describe, expect, test } from "vitest";
import { demoAnalytics } from "./analytics.logic";

describe("demoAnalytics", () => {
  const today = new Date("2026-10-31T12:00:00Z");

  test("is stable per seed and ends today", () => {
    const summary = demoAnalytics("user-1", today);
    expect(demoAnalytics("user-1", today)).toEqual(summary);
    expect(summary.series).toHaveLength(14);
    expect(summary.series.at(-1)?.date).toBe("2026-10-31");
  });

  test("totals match the series", () => {
    const summary = demoAnalytics("user-2", today);
    expect(summary.visitors).toBe(
      summary.series.reduce((sum, point) => sum + point.visitors, 0),
    );
    expect(summary.conversionRate).toBeCloseTo(
      summary.conversions / summary.visitors,
    );
  });
});
