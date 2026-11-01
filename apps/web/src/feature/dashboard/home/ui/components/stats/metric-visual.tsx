"use client";

import {
  TinyAreaChart,
  TinyBarChart,
} from "@/components/dashboardblocks/chart";
import { KPIChart } from "@/components/dashboardblocks/kpi";
import { cn } from "@/lib/utils";
import { bestPoint } from "../../../logic/crm.logic";
import type { MetricVisual as Visual } from "../../../types/crm.types";

const TICKS = 32;
const RING_RADIUS = 26;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const VISUAL_HEIGHT = 56;
const BRAND = "var(--color-chart-2)";

function TickBar({ done, goal }: { done: number; goal: number }) {
  const filled = Math.round(Math.min(done / goal, 1) * TICKS);
  const ticks = Array.from({ length: TICKS }, (_, tick) => ({
    id: `tick-${tick}`,
    on: tick < filled,
  }));

  return (
    <div className="flex h-10 items-stretch gap-[3px]">
      {ticks.map((tick) => (
        <span
          key={tick.id}
          className={cn(
            "flex-1 rounded-full",
            tick.on ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function GoalRing({ goal, value }: { goal: number; value: number }) {
  const share = Math.min(value / 100, 1);
  const goalAngle = (goal / 100) * 360 - 90;
  const goalX = 32 + RING_RADIUS * Math.cos((goalAngle * Math.PI) / 180);
  const goalY = 32 + RING_RADIUS * Math.sin((goalAngle * Math.PI) / 180);

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 64 64" className="size-14 shrink-0" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="7"
          className="stroke-muted"
        />
        <circle
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${share * RING_LENGTH} ${RING_LENGTH}`}
          transform="rotate(-90 32 32)"
          className="stroke-primary"
        />
        <circle
          cx={goalX}
          cy={goalY}
          r="3"
          className="fill-background stroke-foreground"
          strokeWidth="1.5"
        />
      </svg>
      <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-xs">
        <dt className="text-muted-foreground">Now</dt>
        <dd className="font-medium tabular-nums">{value}%</dd>
        <dt className="text-muted-foreground">Goal</dt>
        <dd className="font-medium tabular-nums">{goal}%</dd>
      </dl>
    </div>
  );
}

export default function MetricVisual({
  label,
  value,
  visual,
}: {
  label: string;
  value: number;
  visual: Visual;
}) {
  if (visual.kind === "count") {
    return (
      <KPIChart label={label}>
        <TickBar done={visual.done} goal={visual.goal} />
      </KPIChart>
    );
  }
  if (visual.kind === "goal") {
    return (
      <KPIChart label={label}>
        <GoalRing goal={visual.goal} value={value} />
      </KPIChart>
    );
  }
  if (visual.kind === "trend") {
    return (
      <KPIChart label={label}>
        <TinyAreaChart
          accessibilityLayer={false}
          areas={[
            { dataKey: "value", fill: BRAND, fillOpacity: 0.35, stroke: BRAND },
          ]}
          data={visual.points}
          height={VISUAL_HEIGHT}
          markLast="value"
          scale="data"
        />
      </KPIChart>
    );
  }
  const best = bestPoint(visual.points);
  return (
    <KPIChart label={label}>
      <TinyBarChart
        accessibilityLayer={false}
        bars={[{ dataKey: "value", fill: BRAND, radius: 4 }]}
        data={visual.points}
        height={VISUAL_HEIGHT}
        highlightIndex={best ? visual.points.indexOf(best) : undefined}
        highlightLabel={false}
      />
    </KPIChart>
  );
}
