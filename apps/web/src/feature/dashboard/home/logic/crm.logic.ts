import type {
  DealMetric,
  MetricPoint,
  PipelineStage,
  QuotaPace,
  QuotaProgress,
  SalesRep,
} from "../types/crm.types";

const MORNING_ENDS = 12;
const AFTERNOON_ENDS = 18;

function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

export function greeting(now: Date, name?: string) {
  const hour = now.getHours();
  const part =
    hour < MORNING_ENDS
      ? "morning"
      : hour < AFTERNOON_ENDS
        ? "afternoon"
        : "evening";
  const first = name?.trim().split(/\s+/)[0];
  return first ? `Good ${part}, ${first}` : `Good ${part}`;
}

export function describeWeek(won: number) {
  return won === 0
    ? "No deals closed yet this week"
    : `You've closed ${plural(won, "deal")} this week`;
}

export function describePipeline(
  stages: PipelineStage[],
  format: (value: number) => string,
) {
  const deals = stages.reduce((sum, stage) => sum + stage.deals, 0);
  const value = stages.reduce((sum, stage) => sum + stage.value, 0);
  return `${plural(deals, "open deal")} worth ${format(value)} across ${plural(stages.length, "stage")}.`;
}

export function quotaPace(quota: QuotaProgress): QuotaPace {
  const { daysElapsed, daysInPeriod, target, value } = quota;
  const share = target > 0 ? value / target : 0;
  const expected = Math.min(100, (daysElapsed / daysInPeriod) * 100);
  const projected =
    daysElapsed > 0 ? (value / daysElapsed) * daysInPeriod : value;
  const projectedShare =
    target > 0 ? Math.min(100, (projected / target) * 100) : 0;
  return {
    expected,
    gap: projected - target,
    projected,
    projectedShare,
    share,
  };
}

export function summarizeReps(
  reps: SalesRep[],
  format: (value: number) => string,
) {
  const [first, second] = reps;
  if (!first) return "No closed deals yet.";
  const lead = second
    ? `${first.name} leads with ${format(first.revenue)}, ${format(first.revenue - second.revenue)} ahead of ${second.name}.`
    : `${first.name} leads with ${format(first.revenue)}.`;
  const past = reps.filter((rep) => rep.revenue >= rep.quota).length;
  return `${lead} ${past} of ${plural(reps.length, "rep")} ${past === 1 ? "is" : "are"} past quota.`;
}

export function dueLabel(
  urgency: "overdue" | "today" | "soon" | "later",
  offset: number,
  date: string,
) {
  if (urgency === "overdue") {
    return `${-offset} ${offset === -1 ? "day" : "days"} overdue`;
  }
  if (urgency === "today") return "Due today";
  return offset === 1 ? "Due tomorrow" : `Due ${date}`;
}

export function metricInsight(
  metric: DealMetric,
  format: (value: number) => string,
): string {
  const visual = metric.visual;
  if (visual.kind === "trend") {
    const first = visual.points[0]?.value ?? metric.value;
    const change = metric.value - first;
    const direction = change >= 0 ? "Up" : "Down";
    return `${direction} ${format(Math.abs(change))} over ${visual.points.length} days`;
  }
  if (visual.kind === "count") {
    return `${visual.done} of ${visual.goal} ${visual.unit} closed`;
  }
  if (visual.kind === "goal") {
    const gap = Math.round(Math.abs(metric.value - visual.goal));
    if (metric.value >= visual.goal)
      return `${gap} pts above the ${visual.goal}% goal`;
    return `${gap} pts short of the ${visual.goal}% goal`;
  }
  const best = bestPoint(visual.points);
  if (!best) return "";
  return `Best day ${best.label}, ${best.value} ${visual.unit}`;
}

export function bestPoint(points: MetricPoint[]): MetricPoint | undefined {
  return points.reduce<MetricPoint | undefined>(
    (top, point) => (top && top.value >= point.value ? top : point),
    undefined,
  );
}
