"use client";

import {
  BlockReady,
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  ForecastLegend,
  ForecastStatusLabel,
  getProjectionStatus,
  getRunRate,
  ProjectionBar,
} from "@/components/dashboardblocks/forecast";
import { KPIValue } from "@/components/dashboardblocks/kpi";
import { formatCurrency, formatPercent } from "@/lib/dashboardblocks/format";
import type { MonthToDate } from "../../../types/home.types";

const currency = (value: number) => formatCurrency(value);

const NO_MONTH: MonthToDate = { current: 0, elapsed: 0, target: 0, total: 0 };

type MonthForecastProps = {
  month?: MonthToDate;
  status?: BlockStatus;
};

export default function MonthForecast({ month, status }: MonthForecastProps) {
  const { current, elapsed, target, total } = month ?? NO_MONTH;
  const state = getBlockState(status, month?.current);
  const { projected, rate, remaining, required } = getRunRate({
    current,
    elapsed,
    target,
    total,
  });
  const projection =
    current >= target ? "reached" : getProjectionStatus(projected, target);
  const gap = projected - target;
  const share = formatPercent(target > 0 ? projected / target : 0, {
    maximumFractionDigits: 0,
  });
  const days = (count: number) => `${count} ${count === 1 ? "day" : "days"}`;

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-4">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold tracking-tight">Revenue this month</h2>
            <p className="text-muted-foreground text-sm">
              Month to date, projected at the daily run-rate so far.
            </p>
          </div>
          <ForecastStatusLabel status={projection} />
        </header>
        <dl className="flex flex-wrap items-end gap-x-10 gap-y-3 border-t pt-4">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-sm">
              {month ? `So far, day ${elapsed} of ${total}` : "So far"}
            </dt>
            <dd>
              <KPIValue value={current} format={currency} />
            </dd>
          </div>
          {state !== "empty" && state !== "error" && (
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-sm">Projected</dt>
              <dd>
                <KPIValue
                  className="text-2xl"
                  value={projected}
                  format={currency}
                />
              </dd>
              <dd className="text-muted-foreground text-xs tabular-nums">
                <BlockReady className="text-xs">
                  {share} of {currency(target)}
                </BlockReady>
              </dd>
            </div>
          )}
        </dl>
        <div className="flex flex-col gap-2">
          <ProjectionBar
            current={current}
            max={Math.max(projected, target) * 1.05}
            projected={projected}
            target={target}
          />
          <ForecastLegend
            items={[
              { label: "So far", shape: "bar" },
              { label: "Projected", shape: "striped" },
              { label: "Target", shape: "marker" },
            ]}
          />
        </div>
        <BlockReady className="text-sm">
          <p className="text-sm text-pretty">
            {projection === "reached"
              ? `Target met with ${days(remaining)} to go, at ${currency(rate)} a day.`
              : `At ${currency(rate)} a day the month ends ${currency(Math.abs(gap))} ${gap >= 0 ? "over" : "short"}.`}
            {projection !== "reached" && required !== null && required > 0 && (
              <span className="text-muted-foreground">
                {` Hitting the target takes ${currency(required)} a day for the last ${days(remaining)}.`}
              </span>
            )}
          </p>
        </BlockReady>
      </section>
    </BlockStateProvider>
  );
}
