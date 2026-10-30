"use client";

import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  BreakdownBar,
  type BreakdownSegment,
  BreakdownTable,
  formatShare,
  getTotal,
} from "@/components/dashboardblocks/breakdown";
import { KPIValue } from "@/components/dashboardblocks/kpi";
import { formatCurrency } from "@/lib/dashboardblocks/format";

const TITLE = "Revenue by channel";
const currency = (value: number) => formatCurrency(value);

type ChannelBreakdownProps = {
  segments: BreakdownSegment[];
  summary: string;
  status?: BlockStatus;
};

export default function ChannelBreakdown({
  segments,
  summary,
  status,
}: ChannelBreakdownProps) {
  const state = getBlockState(status, segments);
  const total = getTotal(segments);
  const largest = segments.reduce<BreakdownSegment | undefined>(
    (best, segment) => (best && best.value >= segment.value ? best : segment),
    undefined,
  );

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">{TITLE}</h2>
          <p className="text-muted-foreground text-sm">{summary}</p>
        </header>
        <div className="flex flex-col gap-1 border-t pt-4">
          <KPIValue value={total} format={currency} />
          <BlockReady className="text-sm">
            {largest && total > 0 && (
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">
                  {largest.label}
                </span>{" "}
                is {formatShare(largest.value, total)} of the total.
              </p>
            )}
          </BlockReady>
        </div>
        <BreakdownBar segments={segments} />
        {state === "loading" && <BlockStateRows rows={4} />}
        {!state && (
          <BreakdownTable
            caption={`${TITLE}: ${summary}`}
            format={currency}
            segments={segments}
          />
        )}
      </section>
    </BlockStateProvider>
  );
}
