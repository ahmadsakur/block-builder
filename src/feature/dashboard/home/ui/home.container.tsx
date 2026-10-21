"use client";

import { useEffect, useState } from "react";
import { BlockBusy } from "@/components/dashboardblocks/block-state";
import { DEFAULT_QUERY, STOCK, TODAY } from "../data/home.data";
import { buildStoreData } from "../logic/store-data.logic";
import type { StoreQuery } from "../types/home.types";
import ChannelBreakdown from "./components/channels/channel-breakdown";
import CheckoutFunnel from "./components/funnel/checkout-funnel";
import HomeHeader from "./components/header/home-header";
import LowStockList from "./components/inventory/low-stock-list";
import ProductRevenueTable from "./components/products/product-revenue-table";
import MonthForecast from "./components/revenue/month-forecast";
import RevenueChart from "./components/revenue/revenue-chart";
import ShopperStats from "./components/stats/shopper-stats";

const REFRESH_DELAY_MS = 500;

export default function HomeContainer() {
  const [query, setQuery] = useState<StoreQuery>(DEFAULT_QUERY);
  const [shownQuery, setShownQuery] = useState(query);
  const busy = shownQuery !== query;

  useEffect(() => {
    if (shownQuery === query) return;
    const timer = setTimeout(() => setShownQuery(query), REFRESH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, shownQuery]);

  const update = (patch: Partial<StoreQuery>) =>
    setQuery((current) => ({ ...current, ...patch }));
  const data = buildStoreData(shownQuery, TODAY);

  return (
    <div className="@container flex w-full flex-col gap-8">
      <HomeHeader
        title="Overview"
        query={query}
        today={TODAY}
        onChange={update}
      />
      <BlockBusy
        busy={busy}
        label="Updating the dashboard"
        className="grid gap-x-8 gap-y-12 @4xl:grid-cols-3"
      >
        <div className="@4xl:col-span-3">
          <ShopperStats
            metrics={data.stats}
            comparison={data.previousLabel}
            compare={shownQuery.compare}
          />
        </div>
        <div className="@4xl:col-span-2">
          <RevenueChart
            data={data.chart}
            description={data.bestDay}
            currentLabel={data.rangeLabel}
            previousLabel={data.previousLabel}
            showPrevious={shownQuery.compare}
          />
        </div>
        <MonthForecast month={data.month} />
        <div className="@4xl:col-span-2">
          <ProductRevenueTable rows={data.products} />
        </div>
        <CheckoutFunnel stages={data.funnel} />
        <div className="@4xl:col-span-2">
          <LowStockList items={STOCK} />
        </div>
        <ChannelBreakdown
          segments={data.channels}
          summary={data.channelSummary}
        />
      </BlockBusy>
    </div>
  );
}
