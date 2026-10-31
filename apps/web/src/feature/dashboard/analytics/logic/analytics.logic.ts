import {
  formatDay,
  formatNumber,
  formatPercent,
} from "@/lib/dashboardblocks/format";
import type {
  AnalyticsPoint,
  AnalyticsSummary,
  SparklineMetric,
  VisitorDay,
} from "../types/analytics.types";

const rate = (point: AnalyticsPoint) =>
  point.visitors === 0 ? 0 : point.conversions / point.visitors;

export function analyticsMetrics(summary: AnalyticsSummary): SparklineMetric[] {
  const { series } = summary;
  return [
    {
      history: series.map((point) => point.visitors),
      key: "visitors",
      label: "Visitors",
      value: summary.visitors,
    },
    {
      history: series.map((point) => point.conversions),
      key: "conversions",
      label: "Conversions",
      value: summary.conversions,
    },
    {
      formatter: (value) => formatPercent(value),
      history: series.map(rate),
      key: "conversion-rate",
      label: "Conversion rate",
      value: summary.conversionRate,
    },
  ];
}

export function visitorDays(series: AnalyticsPoint[]): VisitorDay[] {
  const last = series.at(-1);
  const now = last ? new Date(`${last.date}T00:00:00Z`) : undefined;
  return series.map((point) => ({
    conversions: point.conversions,
    label: formatDay(point.date, now),
    visitors: point.visitors,
  }));
}

export function busiestDay(days: VisitorDay[]): string {
  const best = days.reduce<VisitorDay | undefined>(
    (top, day) => (!top || day.visitors > top.visitors ? day : top),
    undefined,
  );
  if (!best) return "No visits in the last 14 days.";
  return `Busiest day: ${best.label}, with ${formatNumber(best.visitors)} visitors.`;
}

export function describeHistory(metric: SparklineMetric): string {
  const format = metric.formatter ?? ((value: number) => formatNumber(value));
  const first = metric.history[0] ?? 0;
  const last = metric.history.at(-1) ?? 0;
  const direction = last > first ? "Up" : last < first ? "Down" : "Flat";
  return `${metric.label} by day: ${direction} from ${format(first)} to ${format(last)}`;
}

export function daysAgo(count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const ago = count - 1 - index;
    if (ago === 0) return "Today";
    if (ago === 1) return "Yesterday";
    return `${ago} days ago`;
  });
}
