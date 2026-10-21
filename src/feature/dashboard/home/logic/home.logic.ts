import { getDaysOfCover } from "@/components/dashboardblocks/inventory";
import { getKPIChange } from "@/components/dashboardblocks/kpi";
import { formatNumber } from "@/lib/dashboardblocks/format";
import type { SparklineMetric, StockItem } from "../types/home.types";

export function describeHistory(metric: SparklineMetric) {
  const format = metric.formatter ?? ((value: number) => formatNumber(value));
  const first = metric.history[0];
  const last = metric.history[metric.history.length - 1];
  const direction = last > first ? "Up" : last < first ? "Down" : "Flat";
  return `${metric.label} by day: ${direction} from ${format(first)} to ${format(last)}`;
}

export function daysAgo(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const ago = count - 1 - index;
    return ago === 0 ? "Today" : ago === 1 ? "Yesterday" : `${ago} days ago`;
  });
}

export function summarizeStats(metrics: SparklineMetric[], comparison: string) {
  const improved = metrics.filter((metric) => {
    const change = getKPIChange(metric) ?? 0;
    return metric.goodDirection === "down" ? change < 0 : change > 0;
  }).length;
  if (improved === metrics.length) {
    return `All ${improved} metrics improved on ${comparison}.`;
  }
  return `${improved} of ${metrics.length} metrics improved on ${comparison}.`;
}

export function summarizeStock(items: StockItem[]) {
  const out = items.filter((item) => item.onHand <= 0).length;
  const late = items.filter((item) => {
    const cover = getDaysOfCover(item.onHand, item.dailyDemand);
    return cover > 0 && cover < item.leadTimeDays;
  }).length;
  const count = `${items.length} ${items.length === 1 ? "item" : "items"} at or near their reorder point`;
  const details = [
    out > 0 && `${out} out of stock`,
    late > 0 && `${late} running out before an order would arrive`,
  ].filter(Boolean);
  return details.length > 0 ? `${count}: ${details.join(", ")}.` : `${count}.`;
}

export function formatCover(cover: number) {
  if (cover === 0) return "Out now";
  if (!Number.isFinite(cover)) return "No demand";
  const days = Math.floor(cover);
  return `${days} ${days === 1 ? "day" : "days"} left`;
}

export function sortByCover(items: StockItem[]) {
  return [...items].sort(
    (a, b) =>
      getDaysOfCover(a.onHand, a.dailyDemand) -
      getDaysOfCover(b.onHand, b.dailyDemand),
  );
}
