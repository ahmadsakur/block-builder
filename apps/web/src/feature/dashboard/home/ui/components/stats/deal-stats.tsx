"use client";

import { Card, CardContent } from "@/components/_ui/card";
import { Skeleton } from "@/components/_ui/skeleton";
import {
  BlockReady,
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  getKPIFormatter,
  KPI,
  KPIChange,
  KPITitle,
  KPIValue,
} from "@/components/dashboardblocks/kpi";
import { placeholderKeys } from "@/lib/placeholder-keys";
import { metricInsight } from "../../../logic/crm.logic";
import type { DealMetric } from "../../../types/crm.types";
import { FLAT_SECTION } from "../home-panel";
import MetricVisual from "./metric-visual";

const formatter = (metric: DealMetric) =>
  metric.format === "currency"
    ? getKPIFormatter("currency-compact")
    : getKPIFormatter(metric.format);

const METRIC_COUNT = 4;

type DealStatsProps = {
  metrics: DealMetric[];
  status?: BlockStatus;
};

type Slot = { key: string; metric?: DealMetric };

export default function DealStats({ metrics, status }: DealStatsProps) {
  const slots: Slot[] =
    status === "loading"
      ? placeholderKeys(METRIC_COUNT).map((key) => ({ key }))
      : metrics.map((metric) => ({ key: metric.key, metric }));

  return (
    <BlockStateProvider state={getBlockState(status, metrics)}>
      <section aria-label="Deals" className="@container">
        <div className="grid gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
          {slots.map(({ key, metric }) => (
            <Card key={key} className={FLAT_SECTION}>
              <CardContent className="h-full">
                <BlockStateProvider
                  state={getBlockState(status, metric?.value)}
                >
                  <KPI className="h-full gap-1 [&_[data-slot=kpi-title]]:mb-3">
                    <KPITitle>{metric?.title ?? "Loading"}</KPITitle>
                    <KPIValue
                      value={metric?.value}
                      format={metric?.format}
                      animated
                    />
                    <KPIChange
                      comparison={metric?.comparison ?? ""}
                      format={metric?.format}
                      previous={metric?.previous}
                      value={metric?.value}
                    />
                    <div className="mt-auto flex flex-col gap-3 pt-5">
                      {metric ? (
                        <MetricVisual
                          label={metricInsight(metric, formatter(metric))}
                          value={metric.value}
                          visual={metric.visual}
                        />
                      ) : (
                        <Skeleton className="h-14 w-full rounded-xl" />
                      )}
                      <BlockReady className="text-xs">
                        <p className="text-muted-foreground text-xs">
                          {metric && metricInsight(metric, formatter(metric))}
                        </p>
                      </BlockReady>
                    </div>
                  </KPI>
                </BlockStateProvider>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </BlockStateProvider>
  );
}
