"use client";

import {
  CloudAlertIcon,
  LayoutDashboardIcon,
  RotateCwIcon,
} from "lucide-react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { useEntitlementsQuery } from "@/feature/dashboard/_shared/query/entitlements.query";
import { queryStatus } from "@/lib/query-status";
import { planLimits } from "../logic/plan.logic";
import PlanUsage from "./components/plan/plan-usage";

export default function HomeContainer() {
  const entitlements = useEntitlementsQuery();
  const data = entitlements.data;

  return (
    <div className="@container flex w-full flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        <p className="text-muted-foreground text-sm">
          Your workspace at a glance.
        </p>
      </header>
      <div className="grid items-start gap-8 @4xl:grid-cols-3">
        {entitlements.isError && !data ? (
          <EmptyState
            bordered
            tone="error"
            icon={<CloudAlertIcon />}
            title="Your plan didn't load"
            description="We couldn't check your plan and usage."
            action={
              <Button variant="outline" onClick={() => entitlements.refetch()}>
                <RotateCwIcon />
                Try again
              </Button>
            }
          />
        ) : (
          <PlanUsage
            plan={data?.plan.name}
            limits={data ? planLimits(data) : []}
            status={queryStatus(entitlements)}
          />
        )}
        <EmptyState
          bordered
          className="@4xl:col-span-2"
          icon={<LayoutDashboardIcon />}
          title="Nothing here yet"
          description="Your dashboard fills in as you start using the app."
        />
      </div>
    </div>
  );
}
