"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  ChartTooltipContent,
  chartActiveDot,
  chartAxisProps,
  chartGridProps,
  chartLastDot,
  chartLineCursor,
  chartValueAxisWidth,
  useChartId,
} from "@/components/dashboardblocks/chart";
import {
  ChartPanelFigure,
  ChartPanelTable,
} from "@/components/dashboardblocks/chart-panel";
import { KPIValue } from "@/components/dashboardblocks/kpi";
import { formatCompact, formatNumber } from "@/lib/dashboardblocks/format";
import type { VisitorDay } from "../../../types/analytics.types";

const TITLE = "Daily visitors";
const COLOR = "var(--color-chart-2)";
const count = (value: number) => formatNumber(value);

type VisitorsChartProps = {
  days: VisitorDay[];
  description: string;
  status?: BlockStatus;
};

export default function VisitorsChart({
  days,
  description,
  status,
}: VisitorsChartProps) {
  const gradient = useChartId();
  const total = days.reduce((sum, day) => sum + day.visitors, 0);

  return (
    <BlockStateProvider state={getBlockState(status, days)}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">{TITLE}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </header>
        <div className="flex flex-col gap-1 border-t pt-4">
          <KPIValue value={total} format={count} />
        </div>
        <ChartPanelFigure className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              aria-label={`${TITLE} chart`}
              data={days}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartGridProps} />
              <XAxis
                {...chartAxisProps}
                dataKey="label"
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                {...chartAxisProps}
                tickFormatter={(value: number) => formatCompact(value)}
                width={chartValueAxisWidth}
              />
              <Tooltip
                content={(tooltipProps) => (
                  <ChartTooltipContent
                    {...tooltipProps}
                    valueFormatter={count}
                  />
                )}
                cursor={chartLineCursor}
              />
              <Area
                activeDot={chartActiveDot}
                dataKey="visitors"
                dot={chartLastDot(days.length, COLOR)}
                fill={`url(#${gradient})`}
                name="Visitors"
                stroke={COLOR}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanelFigure>
        <ChartPanelTable
          caption={`${TITLE}: ${description}`}
          columns={[
            { key: "label", label: "Day" },
            { format: count, key: "visitors", label: "Visitors" },
            { format: count, key: "conversions", label: "Conversions" },
          ]}
          rows={days}
        />
      </section>
    </BlockStateProvider>
  );
}
