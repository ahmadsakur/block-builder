"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
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
  ChartPanelLegend,
  ChartPanelTable,
} from "@/components/dashboardblocks/chart-panel";
import { KPIChange, KPIValue } from "@/components/dashboardblocks/kpi";
import { formatCompact, formatCurrency } from "@/lib/dashboardblocks/format";
import type { RevenuePoint } from "../../../types/home.types";

const TITLE = "Revenue";
const CURRENT_COLOR = "var(--color-chart-2)";
const PREVIOUS_COLOR = "var(--color-muted-foreground)";
const currency = (value: number) => formatCurrency(value);

type RevenueChartProps = {
  data: RevenuePoint[];
  description: string;
  currentLabel: string;
  previousLabel: string;
  showPrevious: boolean;
  status?: BlockStatus;
};

export default function RevenueChart({
  data,
  description,
  currentLabel,
  previousLabel,
  showPrevious,
  status,
}: RevenueChartProps) {
  const gradient = useChartId();
  const currentTotal = data.reduce((sum, point) => sum + point.current, 0);
  const previousTotal = data.reduce((sum, point) => sum + point.previous, 0);

  return (
    <BlockStateProvider state={getBlockState(status, data)}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">{TITLE}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </header>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t pt-4">
          <div className="flex flex-col gap-1">
            <KPIValue value={currentTotal} format={currency} />
            {showPrevious && (
              <KPIChange
                comparison={`in ${previousLabel}`}
                format={currency}
                previous={previousTotal}
                value={currentTotal}
              />
            )}
          </div>
          {showPrevious && (
            <ChartPanelLegend
              items={[
                { color: CURRENT_COLOR, label: currentLabel, shape: "line" },
                { color: PREVIOUS_COLOR, label: previousLabel, shape: "line" },
              ]}
            />
          )}
        </div>
        <ChartPanelFigure className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              aria-label={`${TITLE} chart`}
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CURRENT_COLOR}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={CURRENT_COLOR}
                    stopOpacity={0}
                  />
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
                    valueFormatter={currency}
                  />
                )}
                cursor={chartLineCursor}
                itemSorter={(item) => (item.dataKey === "current" ? 0 : 1)}
              />
              {showPrevious && (
                <Line
                  activeDot={chartActiveDot}
                  dataKey="previous"
                  dot={false}
                  name={previousLabel}
                  stroke={PREVIOUS_COLOR}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  type="monotone"
                />
              )}
              <Area
                activeDot={chartActiveDot}
                dataKey="current"
                dot={chartLastDot(data.length, CURRENT_COLOR)}
                fill={`url(#${gradient})`}
                name={currentLabel}
                stroke={CURRENT_COLOR}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                type="monotone"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartPanelFigure>
        <ChartPanelTable
          caption={`${TITLE}: ${description}`}
          columns={[
            { key: "label", label: "Day" },
            { format: currency, key: "current", label: currentLabel },
            ...(showPrevious
              ? [{ format: currency, key: "previous", label: previousLabel }]
              : []),
          ]}
          rows={data}
        />
      </section>
    </BlockStateProvider>
  );
}
