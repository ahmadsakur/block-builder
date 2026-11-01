import { describe, expect, test } from "vitest";
import type { QuotaProgress, SalesRep } from "../types/crm.types";
import {
  describePipeline,
  describeWeek,
  dueLabel,
  greeting,
  quotaPace,
  summarizeReps,
} from "./crm.logic";

const money = (value: number) => `$${value}`;

describe("greeting", () => {
  test("follows the time of day and uses the first name", () => {
    expect(greeting(new Date(2026, 10, 1, 9), "Ana Lima")).toBe(
      "Good morning, Ana",
    );
    expect(greeting(new Date(2026, 10, 1, 14), "Ana")).toBe(
      "Good afternoon, Ana",
    );
    expect(greeting(new Date(2026, 10, 1, 20))).toBe("Good evening");
  });
});

test("describeWeek counts closed deals", () => {
  expect(describeWeek(0)).toBe("No deals closed yet this week");
  expect(describeWeek(1)).toBe("You've closed 1 deal this week");
  expect(describeWeek(4)).toBe("You've closed 4 deals this week");
});

test("describePipeline sums deals and value across stages", () => {
  expect(
    describePipeline(
      [
        { deals: 2, key: "a", label: "A", value: 10 },
        { deals: 1, key: "b", label: "B", value: 5 },
      ],
      money,
    ),
  ).toBe("3 open deals worth $15 across 2 stages.");
});

describe("quotaPace", () => {
  const quota: QuotaProgress = {
    comparison: "last month",
    daysElapsed: 10,
    daysInPeriod: 30,
    previous: 0,
    target: 300,
    title: "Team quota",
    value: 50,
  };

  test("projects the month from the pace so far", () => {
    expect(quotaPace(quota)).toEqual({
      expected: (10 / 30) * 100,
      gap: -150,
      projected: 150,
      projectedShare: 50,
      share: 50 / 300,
    });
  });

  test("caps the projection bar at the target", () => {
    expect(quotaPace({ ...quota, value: 200 }).projectedShare).toBe(100);
  });
});

test("summarizeReps names the leader and counts reps past quota", () => {
  const rep = (name: string, revenue: number): SalesRep => ({
    deals: 1,
    id: name,
    name,
    quota: 100,
    revenue,
    trend: 0,
  });
  expect(summarizeReps([rep("Ana", 150), rep("Bo", 90)], money)).toBe(
    "Ana leads with $150, $60 ahead of Bo. 1 of 2 reps is past quota.",
  );
  expect(summarizeReps([], money)).toBe("No closed deals yet.");
});

test("dueLabel words each urgency", () => {
  expect(dueLabel("overdue", -1, "Oct 31")).toBe("1 day overdue");
  expect(dueLabel("overdue", -3, "Oct 29")).toBe("3 days overdue");
  expect(dueLabel("today", 0, "Nov 1")).toBe("Due today");
  expect(dueLabel("soon", 1, "Nov 2")).toBe("Due tomorrow");
  expect(dueLabel("later", 4, "Nov 5")).toBe("Due Nov 5");
});
