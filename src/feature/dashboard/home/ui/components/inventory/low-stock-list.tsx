"use client";

import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import { Details } from "@/components/dashboardblocks/details";
import {
  getDaysOfCover,
  getReorderQuantity,
  getStockStatus,
  ReorderPointKey,
  StockBar,
  StockStatusLabel,
} from "@/components/dashboardblocks/inventory";
import { formatNumber, joinDetails } from "@/lib/dashboardblocks/format";
import { cn } from "@/lib/utils";
import {
  formatCover,
  sortByCover,
  summarizeStock,
} from "../../../logic/home.logic";
import type { StockItem } from "../../../types/home.types";

type LowStockListProps = {
  items: StockItem[];
  targetDays?: number;
  status?: BlockStatus;
};

export default function LowStockList({
  items,
  targetDays = 30,
  status,
}: LowStockListProps) {
  const state = getBlockState(status, items);
  const capacity =
    Math.max(...items.map((item) => Math.max(item.onHand, item.reorderPoint))) *
    1.1;

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-3">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">Low stock</h2>
          <BlockReady className="text-sm">
            <p className="text-muted-foreground text-sm">
              {summarizeStock(items)}
            </p>
          </BlockReady>
        </header>
        <BlockStateRows className="border-t" rows={4} />
        {!state && (
          <ul className="flex flex-col border-t">
            {sortByCover(items).map((item) => {
              const cover = getDaysOfCover(item.onHand, item.dailyDemand);
              const late = cover < item.leadTimeDays;
              const reorder = getReorderQuantity({ ...item, targetDays });
              return (
                <li
                  key={item.sku}
                  className="flex flex-col gap-2 border-b py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {item.sku}
                      </span>
                    </div>
                    <StockStatusLabel status={getStockStatus(item)} />
                  </div>
                  <StockBar
                    capacity={capacity}
                    onHand={item.onHand}
                    reorderPoint={item.reorderPoint}
                  />
                  <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs tabular-nums">
                    <span>
                      {joinDetails(
                        `${formatNumber(item.onHand)} on hand`,
                        `reorder at ${formatNumber(item.reorderPoint)}`,
                        item.onOrder
                          ? `${formatNumber(item.onOrder)} on order`
                          : undefined,
                      )}
                    </span>
                    <Details>
                      <span
                        className={cn(
                          late && "font-medium text-red-700 dark:text-red-400",
                        )}
                      >
                        {formatCover(cover)}
                        {late && cover > 0 && (
                          <span className="sr-only">
                            , runs out before a new order would arrive
                          </span>
                        )}
                      </span>
                      {reorder > 0 && (
                        <span className="text-foreground font-medium">
                          Order {formatNumber(reorder)}
                        </span>
                      )}
                    </Details>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {state !== "empty" && state !== "error" && (
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <ReorderPointKey />
            <span>
              Red days: runs out before an order placed today arrives.
            </span>
          </div>
        )}
      </section>
    </BlockStateProvider>
  );
}
