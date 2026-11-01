import type {
  AnalyticsPoint,
  AnalyticsSummary,
} from "@block-builder/shared/analytics";

function seeded(seed: string): () => number {
  let state = [...seed].reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
}

export function demoAnalytics(
  seed: string,
  today: Date,
  days = 14,
): AnalyticsSummary {
  const random = seeded(seed);
  const series: AnalyticsPoint[] = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (days - 1 - index));
    const visitors = 200 + Math.round(random() * 300);
    return {
      conversions: Math.round(visitors * (0.02 + random() * 0.04)),
      date: date.toISOString().slice(0, 10),
      visitors,
    };
  });
  const visitors = series.reduce((sum, point) => sum + point.visitors, 0);
  const conversions = series.reduce((sum, point) => sum + point.conversions, 0);
  return {
    conversionRate: visitors === 0 ? 0 : conversions / visitors,
    conversions,
    series,
    visitors,
  };
}
