import type { CrmOverview } from "../types/crm.types";

const DAY_MS = 86_400_000;
const DAYS_IN_MONTH = 30;
const DAYS_ELAPSED = 18;
const PIPELINE_TREND = [
  241_500, 243_900, 242_100, 246_800, 249_200, 248_000, 252_600, 255_100,
  253_700, 258_900, 261_400, 260_200, 264_800, 268_200,
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAILY_LEADS = [6, 8, 5, 11, 7, 3, 4];

function series(values: number[]) {
  return values.map((value, index) => ({
    label: `Day ${index + 1}`,
    value,
  }));
}

export function crmOverview(now: Date): CrmOverview {
  const day = (offset: number) => new Date(now.getTime() + offset * DAY_MS);

  return {
    followUps: [
      {
        name: "Today",
        tasks: [
          {
            due: day(-1),
            id: "f1",
            owner: "Sarah",
            title: "Send revised quote to Northwind",
          },
          {
            done: true,
            due: day(0),
            id: "f2",
            owner: "Marcus",
            title: "Discovery call with Globex",
          },
          {
            due: day(0),
            id: "f3",
            owner: "Priya",
            title: "Book onboarding for Initech",
          },
        ],
      },
      {
        name: "This week",
        tasks: [
          {
            due: day(1),
            id: "f4",
            owner: "Diego",
            title: "Demo for Umbrella Labs",
          },
          {
            due: day(3),
            id: "f5",
            owner: "Emma",
            title: "Follow up on Soylent proposal",
          },
        ],
      },
    ],
    metrics: [
      {
        comparison: "last month",
        format: "currency",
        key: "pipeline",
        previous: 241_500,
        title: "Open pipeline",
        value: 268_200,
        visual: { kind: "trend", points: series(PIPELINE_TREND) },
      },
      {
        comparison: "last month",
        format: "currency",
        key: "won",
        previous: 72_100,
        title: "Won this month",
        value: 86_400,
        visual: { done: 24, goal: 40, kind: "count", unit: "deals" },
      },
      {
        comparison: "last month",
        format: "percent",
        key: "win-rate",
        previous: 27,
        title: "Win rate",
        value: 31,
        visual: { goal: 35, kind: "goal" },
      },
      {
        comparison: "last month",
        key: "leads",
        previous: 162,
        title: "New leads",
        value: 148,
        visual: {
          kind: "daily",
          points: WEEKDAYS.map((label, index) => ({
            label,
            value: DAILY_LEADS[index],
          })),
          unit: "leads",
        },
      },
    ],
    now,
    quota: {
      comparison: "last month",
      daysElapsed: DAYS_ELAPSED,
      daysInPeriod: DAYS_IN_MONTH,
      previous: 72_100,
      target: 150_000,
      title: "Team quota",
      value: 86_400,
    },
    reps: [
      {
        deals: 14,
        id: "r1",
        name: "Sarah Chen",
        quota: 30_000,
        revenue: 34_200,
        trend: 12.4,
      },
      {
        deals: 11,
        id: "r2",
        name: "Marcus Reid",
        quota: 30_000,
        revenue: 26_900,
        trend: 8.1,
      },
      {
        deals: 9,
        id: "r3",
        name: "Priya Patel",
        quota: 25_000,
        revenue: 18_400,
        trend: -2.3,
      },
      {
        deals: 6,
        id: "r4",
        name: "Diego Alvarez",
        quota: 25_000,
        revenue: 6_900,
        trend: 4.6,
      },
    ],
    stages: [
      { deals: 12, key: "qualified", label: "Qualified", value: 84_000 },
      { deals: 7, key: "proposal", label: "Proposal", value: 126_500 },
      { deals: 3, key: "negotiation", label: "Negotiation", value: 57_700 },
    ],
    wonThisWeek: 4,
  };
}
