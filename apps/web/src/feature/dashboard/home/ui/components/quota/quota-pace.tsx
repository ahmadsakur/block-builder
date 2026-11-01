"use client";

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
  KPIContent,
  KPITitle,
  KPIValue,
} from "@/components/dashboardblocks/kpi";
import { formatPercent } from "@/lib/dashboardblocks/format";
import { cn } from "@/lib/utils";
import { quotaPace } from "../../../logic/crm.logic";
import type { QuotaProgress } from "../../../types/crm.types";

const FORMAT = "currency";

type QuotaPaceProps = {
  quota?: QuotaProgress;
  status?: BlockStatus;
};

export default function QuotaPaceCard({ quota, status }: QuotaPaceProps) {
  const formatter = getKPIFormatter(FORMAT);
  const pace = quota ? quotaPace(quota) : undefined;
  const share = pace?.share ?? 0;
  const gap = pace?.gap ?? 0;

  return (
    <BlockStateProvider state={getBlockState(status, quota?.value)}>
      <KPI>
        <KPIContent className="gap-1">
          <KPITitle className="mb-3">{quota?.title ?? "Team quota"}</KPITitle>
          <KPIValue value={quota?.value} format={FORMAT} animated />
          <KPIChange
            comparison={quota?.comparison ?? ""}
            format={FORMAT}
            previous={quota?.previous}
            value={quota?.value}
          />
          <div className="mt-6 flex flex-col gap-2">
            <div className="text-muted-foreground flex items-baseline justify-between gap-2 text-sm">
              <BlockReady className="w-1/2">
                <span>
                  <span className="text-foreground font-medium tabular-nums">
                    {formatPercent(share, { maximumFractionDigits: 0 })}
                  </span>{" "}
                  of {formatter(quota?.target ?? 0)}
                </span>
              </BlockReady>
              {quota && (
                <span className="ml-auto text-xs tabular-nums">
                  Day {quota.daysElapsed} of {quota.daysInPeriod}
                </span>
              )}
            </div>
            <div
              aria-hidden
              className={cn(
                "bg-muted relative h-2.5 rounded-full",
                status === "loading" &&
                  "animate-pulse motion-reduce:animate-none",
              )}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--color-chart-2)_45%,transparent)_0_2px,transparent_2px_5px)]"
                style={{ width: `${pace?.projectedShare ?? 0}%` }}
              />
              <span
                className="bg-chart-2 absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${Math.min(100, share * 100)}%` }}
              />
              <span
                className="bg-foreground absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full"
                style={{ left: `${pace?.expected ?? 0}%` }}
              />
            </div>
            <BlockReady className="text-xs">
              <p className="text-muted-foreground text-xs">
                On pace for{" "}
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    gap >= 0 ? "text-success" : "text-warning",
                  )}
                >
                  {formatter(pace?.projected ?? 0)}
                </span>
                , {formatter(Math.abs(gap))} {gap >= 0 ? "over" : "short of"}{" "}
                quota. The hatched bar is the projection, the line an even pace.
              </p>
            </BlockReady>
          </div>
        </KPIContent>
      </KPI>
    </BlockStateProvider>
  );
}
