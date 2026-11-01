import { expect, test } from "vitest";
import type { AnalyticsSummary } from "../types/analytics.types";
import {
  analyticsMetrics,
  busiestDay,
  daysAgo,
  visitorDays,
} from "./analytics.logic";

const SUMMARY: AnalyticsSummary = {
  conversionRate: 0.05,
  conversions: 30,
  series: [
    { conversions: 10, date: "2026-10-29", visitors: 200 },
    { conversions: 15, date: "2026-10-30", visitors: 300 },
    { conversions: 5, date: "2026-10-31", visitors: 100 },
  ],
  visitors: 600,
};

test("analyticsMetrics turns totals and the series into stat metrics", () => {
  const [visitors, conversions, rate] = analyticsMetrics(SUMMARY);
  expect(visitors).toMatchObject({ history: [200, 300, 100], value: 600 });
  expect(conversions).toMatchObject({ history: [10, 15, 5], value: 30 });
  expect(rate.history).toEqual([0.05, 0.05, 0.05]);
  expect(rate.formatter?.(rate.value)).toBe("5%");
});

test("visitorDays labels each day and busiestDay names the peak", () => {
  const days = visitorDays(SUMMARY.series);
  expect(days.map((day) => day.label)).toEqual(["Oct 29", "Oct 30", "Oct 31"]);
  expect(busiestDay(days)).toBe("Busiest day: Oct 30, with 300 visitors.");
  expect(busiestDay([])).toBe("No visits in the last 14 days.");
});

test("daysAgo counts back to today", () => {
  expect(daysAgo(3)).toEqual(["2 days ago", "Yesterday", "Today"]);
});
