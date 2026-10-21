"use client";

import {
  BlockReady,
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  formatStatValue,
  getStatPlaceholders,
  Stat,
  StatChange,
  StatGroup,
  StatLabel,
  StatSparkline,
  StatValue,
} from "@/components/dashboardblocks/stat-group";
import {
  daysAgo,
  describeHistory,
  summarizeStats,
} from "../../../logic/home.logic";
import type { SparklineMetric } from "../../../types/home.types";

type ShopperStatsProps = {
  metrics: SparklineMetric[];
  comparison: string;
  compare: boolean;
  status?: BlockStatus;
};

export default function ShopperStats({
  metrics,
  comparison,
  compare,
  status,
}: ShopperStatsProps) {
  const description = compare
    ? summarizeStats(metrics, comparison)
    : "Sessions, orders, order value and conversion, by day.";
  const shown: SparklineMetric[] =
    status === "loading"
      ? getStatPlaceholders(4).map((metric) => ({ ...metric, history: [] }))
      : metrics;

  return (
    <BlockStateProvider state={getBlockState(status, metrics)}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">Shoppers and orders</h2>
          <BlockReady className="text-sm">
            <p className="text-muted-foreground text-sm">{description}</p>
          </BlockReady>
        </header>
        <StatGroup className="grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-4">
          {shown.map((metric) => (
            <Stat
              key={metric.key}
              className="grid grid-cols-[minmax(0,1fr)_6rem] content-start gap-x-4 gap-y-1 @md:grid-cols-1"
            >
              <StatLabel>{metric.label}</StatLabel>
              <StatValue className="text-3xl @4xl:text-4xl">
                {formatStatValue(metric)}
              </StatValue>
              <StatChange
                comparison={comparison}
                metric={metric}
                variant="short"
              />
              <dd className="col-start-2 row-span-3 row-start-1 self-center @md:col-start-1 @md:row-span-1 @md:row-start-4 @md:mt-3">
                <StatSparkline
                  data={metric.history}
                  formatter={metric.formatter}
                  label={describeHistory(metric)}
                  labels={daysAgo(metric.history.length)}
                />
              </dd>
            </Stat>
          ))}
        </StatGroup>
      </section>
    </BlockStateProvider>
  );
}
