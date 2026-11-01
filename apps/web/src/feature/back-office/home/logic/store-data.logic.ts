import {
  getDateRange,
  getPreset,
  getPreviousRange,
} from "@/components/dashboardblocks/dashboard-header";
import {
  formatCurrency,
  formatDateRange,
  formatPercent,
} from "@/lib/dashboardblocks/format";
import { CHANNELS, DAILY_TARGET, PRODUCTS, REGIONS } from "../data/home.data";
import type { StoreData, StoreQuery } from "../types/home.types";

const DAY_MS = 86_400_000;

export function revenueAt(
  offset: number,
  region: string | null,
  hourly: boolean,
) {
  const regions = region
    ? REGIONS.filter((item) => item.name === region)
    : REGIONS;
  return regions.reduce((sum, { phase, share }) => {
    if (hourly) {
      const hour = 23 - offset;
      const curve =
        Math.exp(-((hour - 14) ** 2) / 20) +
        0.35 * Math.exp(-((hour - 21) ** 2) / 6);
      return sum + share * (20 + 170 * curve);
    }
    const weekend = (offset + 2) % 7 < 2 ? 0.8 : 1;
    const trend = 1_700 - offset * 3.2;
    const wave =
      Math.sin(offset / 3.1 + phase) * 180 +
      Math.sin(offset / 11 + phase) * 120;
    return sum + share * (trend + wave) * weekend;
  }, 0);
}

const aovAt = (offset: number) => 36.5 + Math.sin(offset / 5) * 1.6;

const conversionAt = (offset: number) =>
  0.031 + Math.sin(offset / 7 + 1) * 0.003;

export function splitTotal(total: number, shares: number[]) {
  const parts = shares.map((share) => Math.round(total * share));
  parts[parts.length - 1] =
    total - parts.slice(0, -1).reduce((sum, part) => sum + part, 0);
  return parts;
}

export function buildStoreData(
  { compare, preset, region }: StoreQuery,
  today: Date,
): StoreData {
  const hourly = preset === "today";
  const length = hourly ? 24 : getPreset(preset).days;
  const range = getDateRange(preset, today);
  const previousRange = getPreviousRange(range);

  const series = (shift: number) =>
    Array.from({ length }, (_, index) => {
      const offset = length - 1 - index + shift;
      const revenue = Math.round(revenueAt(offset, region, hourly));
      const orders = revenue / aovAt(offset);
      return { orders, revenue, sessions: orders / conversionAt(offset) };
    });
  const current = series(0);
  const previous = series(length);

  const totals = (points: typeof current) => {
    const sum = (key: "orders" | "revenue" | "sessions") =>
      points.reduce((total, point) => total + point[key], 0);
    const revenue = sum("revenue");
    const orders = sum("orders");
    const sessions = sum("sessions");
    return {
      aov: revenue / orders,
      conversion: (orders / sessions) * 100,
      orders,
      revenue,
      sessions,
    };
  };
  const now = totals(current);
  const before = totals(previous);

  const label = (index: number) => {
    if (hourly) return `${String(index).padStart(2, "0")}:00`;
    return new Date(range.start.getTime() + index * DAY_MS).toLocaleDateString(
      "en-US",
      { day: "numeric", month: "short", timeZone: "UTC" },
    );
  };

  const elapsed = today.getUTCDate();
  const daysInMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const regionShare = region
    ? (REGIONS.find((item) => item.name === region)?.share ?? 1)
    : 1;

  const best = current.reduce(
    (top, point, index) => (point.revenue > current[top].revenue ? index : top),
    0,
  );

  const channels = splitTotal(
    now.revenue,
    CHANNELS.map(
      (channel, index) => channel.share + (region ? (index - 1.5) * 0.02 : 0),
    ),
  ).map((value, index) => ({
    color: CHANNELS[index].color,
    label: CHANNELS[index].label,
    value,
  }));
  const search = channels
    .filter((channel) => channel.label.endsWith("search"))
    .reduce((sum, channel) => sum + channel.value, 0);

  return {
    bestDay: `${hourly ? "Busiest hour" : "Best day"} was ${label(best)}, at ${formatCurrency(current[best].revenue)}.`,
    channels,
    channelSummary: `Search brings in ${formatPercent(search / now.revenue, { maximumFractionDigits: 0 })} of revenue, organic and paid together.`,
    chart: current.map((point, index) => ({
      current: Math.round(point.revenue),
      label: label(index),
      previous: Math.round(previous[index].revenue),
    })),
    funnel: [
      { label: "Sessions", value: Math.round(now.sessions) },
      { label: "Viewed a product", value: Math.round(now.sessions * 0.62) },
      { label: "Added to cart", value: Math.round(now.sessions * 0.17) },
      { label: "Started checkout", value: Math.round(now.sessions * 0.071) },
      { label: "Purchased", value: Math.round(now.orders) },
    ],
    month: {
      current: Array.from({ length: elapsed }, (_, offset) =>
        Math.round(revenueAt(offset, region, false)),
      ).reduce((sum, value) => sum + value, 0),
      elapsed,
      target:
        Math.round((DAILY_TARGET * daysInMonth * regionShare) / 1_000) * 1_000,
      total: daysInMonth,
    },
    previousLabel: formatDateRange(previousRange),
    products: splitTotal(
      now.revenue,
      PRODUCTS.map((product) => product.share),
    ).map((revenue, index) => ({
      category: PRODUCTS[index].category,
      name: PRODUCTS[index].name,
      revenue,
      units: Math.max(1, Math.round(revenue / PRODUCTS[index].price)),
    })),
    rangeLabel: formatDateRange(range),
    stats: [
      {
        history: current.map((point) => Math.round(point.sessions)),
        key: "sessions",
        label: "Sessions",
        previous: compare ? Math.round(before.sessions) : undefined,
        value: Math.round(now.sessions),
      },
      {
        history: current.map((point) => Math.round(point.orders)),
        key: "orders",
        label: "Orders",
        previous: compare ? Math.round(before.orders) : undefined,
        value: Math.round(now.orders),
      },
      {
        formatter: (value: number) =>
          formatCurrency(value, { precision: "exact" }),
        history: current.map((point) =>
          Number((point.revenue / point.orders).toFixed(2)),
        ),
        key: "aov",
        label: "Avg order value",
        previous: compare ? Number(before.aov.toFixed(2)) : undefined,
        value: Number(now.aov.toFixed(2)),
      },
      {
        changeType: "points",
        formatter: (value: number) => formatPercent(value / 100),
        history: current.map((point) =>
          Number(((point.orders / point.sessions) * 100).toFixed(1)),
        ),
        key: "conversion",
        label: "Conversion rate",
        previous: compare ? Number(before.conversion.toFixed(1)) : undefined,
        value: Number(now.conversion.toFixed(1)),
      },
    ],
  };
}
