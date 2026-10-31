"use client";

import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import LockedFeature from "@/feature/dashboard/_shared/ui/components/locked-feature";
import FeatureGate from "@/feature/dashboard/_shared/ui/feature-gate";
import { isAccessError } from "@/lib/api";
import { queryStatus } from "@/lib/query-status";
import {
  analyticsMetrics,
  busiestDay,
  visitorDays,
} from "../logic/analytics.logic";
import { useAnalyticsQuery } from "../query/analytics.query";
import ReportSkeleton from "./components/report-skeleton";
import TrafficStats from "./components/stats/traffic-stats";
import VisitorsChart from "./components/visitors/visitors-chart";

function AnalyticsReport() {
  const analytics = useAnalyticsQuery();
  const data = analytics.data;
  const status = queryStatus(analytics);

  if (analytics.isError && !data) {
    const error = analytics.error;
    if (isAccessError(error) && error.body.permission) {
      return (
        <LockedFeature
          permission={error.body.permission}
          message={error.message}
        />
      );
    }
    return (
      <EmptyState
        bordered
        tone="error"
        icon={<CloudAlertIcon />}
        title="Analytics didn't load"
        description="We couldn't reach your traffic numbers. Check your connection and try again."
        action={
          <Button variant="outline" onClick={() => analytics.refetch()}>
            <RotateCwIcon />
            Try again
          </Button>
        }
      />
    );
  }

  const days = data ? visitorDays(data.series) : [];

  return (
    <div className="flex flex-col gap-12">
      <TrafficStats
        metrics={data ? analyticsMetrics(data) : []}
        status={status}
      />
      <VisitorsChart
        days={days}
        description={busiestDay(days)}
        status={status}
      />
    </div>
  );
}

export default function AnalyticsContainer() {
  return (
    <div className="@container flex w-full flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visitors and conversions over the last 14 days.
        </p>
      </header>
      <FeatureGate permission="analytics.view" fallback={<ReportSkeleton />}>
        <AnalyticsReport />
      </FeatureGate>
    </div>
  );
}
