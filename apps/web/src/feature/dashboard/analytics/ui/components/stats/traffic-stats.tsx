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
  StatGroup,
  StatLabel,
  StatSparkline,
  StatValue,
} from "@/components/dashboardblocks/stat-group";
import { daysAgo, describeHistory } from "../../../logic/analytics.logic";
import type { SparklineMetric } from "../../../types/analytics.types";

const PLACEHOLDERS = 3;

type TrafficStatsProps = {
  metrics: SparklineMetric[];
  status?: BlockStatus;
};

export default function TrafficStats({ metrics, status }: TrafficStatsProps) {
  const shown: SparklineMetric[] =
    status === "loading"
      ? getStatPlaceholders(PLACEHOLDERS).map((metric) => ({
          ...metric,
          history: [],
        }))
      : metrics;

  return (
    <BlockStateProvider state={getBlockState(status, metrics)}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">Traffic</h2>
          <BlockReady className="text-sm">
            <p className="text-muted-foreground text-sm">
              Totals for the last 14 days, with each day sketched below.
            </p>
          </BlockReady>
        </header>
        <StatGroup className="grid-cols-1 @md:grid-cols-3">
          {shown.map((metric) => (
            <Stat
              key={metric.key}
              className="grid grid-cols-[minmax(0,1fr)_6rem] content-start gap-x-4 gap-y-1 @md:grid-cols-1"
            >
              <StatLabel>{metric.label}</StatLabel>
              <StatValue className="text-3xl @4xl:text-4xl">
                {formatStatValue(metric)}
              </StatValue>
              <dd className="col-start-2 row-span-2 row-start-1 self-center @md:col-start-1 @md:row-span-1 @md:row-start-3 @md:mt-3">
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
