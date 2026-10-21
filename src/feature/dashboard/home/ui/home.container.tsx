"use client";

import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { BlockBusy } from "@/components/dashboardblocks/block-state";
import { queryStatus } from "@/lib/query-status";
import { TODAY } from "../data/home.data";
import {
  useLowStockQuery,
  useStoreOverviewQuery,
  useStoreQueryParams,
} from "../query/home.query";
import ChannelBreakdown from "./components/channels/channel-breakdown";
import CheckoutFunnel from "./components/funnel/checkout-funnel";
import HomeHeader from "./components/header/home-header";
import LowStockList from "./components/inventory/low-stock-list";
import ProductRevenueTable from "./components/products/product-revenue-table";
import MonthForecast from "./components/revenue/month-forecast";
import RevenueChart from "./components/revenue/revenue-chart";
import ShopperStats from "./components/stats/shopper-stats";

export default function HomeContainer() {
  const [query, setQuery] = useStoreQueryParams();
  const overview = useStoreOverviewQuery(query);
  const lowStock = useLowStockQuery();
  const status = queryStatus(overview);
  const data = overview.data;

  return (
    <div className="@container flex w-full flex-col gap-8">
      <HomeHeader
        title="Overview"
        query={query}
        today={TODAY}
        onChange={setQuery}
      />
      {overview.isError && !overview.data ? (
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="The dashboard didn't load"
          description="We couldn't reach the store data. Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => overview.refetch()}>
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
      ) : (
        <BlockBusy
          busy={overview.isPlaceholderData}
          label="Updating the dashboard"
          className="grid gap-x-8 gap-y-12 @4xl:grid-cols-3"
        >
          <div className="@4xl:col-span-3">
            <ShopperStats
              metrics={data?.stats ?? []}
              comparison={data?.previousLabel ?? "the previous period"}
              compare={query.compare}
              status={status}
            />
          </div>
          <div className="@4xl:col-span-2">
            <RevenueChart
              data={data?.chart ?? []}
              description={data?.bestDay ?? ""}
              currentLabel={data?.rangeLabel ?? ""}
              previousLabel={data?.previousLabel ?? ""}
              showPrevious={query.compare}
              status={status}
            />
          </div>
          <MonthForecast month={data?.month} status={status} />
          <div className="@4xl:col-span-2">
            <ProductRevenueTable rows={data?.products ?? []} status={status} />
          </div>
          <CheckoutFunnel stages={data?.funnel ?? []} status={status} />
          <div className="@4xl:col-span-2">
            <LowStockList
              items={lowStock.data ?? []}
              status={queryStatus(lowStock)}
            />
          </div>
          <ChannelBreakdown
            segments={data?.channels ?? []}
            summary={data?.channelSummary ?? ""}
            status={status}
          />
        </BlockBusy>
      )}
    </div>
  );
}
