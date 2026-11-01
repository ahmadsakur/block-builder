"use client";

import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { useEntitlementsQuery } from "@/feature/dashboard/_shared/query/entitlements.query";
import { useSessionQuery } from "@/lib/auth/session-query";
import { queryStatus } from "@/lib/query-status";
import { planLimits } from "../logic/plan.logic";
import { useCrmOverviewQuery } from "../query/crm.query";
import WelcomeHero from "./components/hero/welcome-hero";
import HomePanel from "./components/home-panel";
import PlanUsage from "./components/plan/plan-usage";
import QuotaPaceCard from "./components/quota/quota-pace";
import DealStats from "./components/stats/deal-stats";
import FollowUps from "./components/tasks/follow-ups";
import TopPerformers from "./components/team/top-performers";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

function YourPlan() {
  const entitlements = useEntitlementsQuery();
  const data = entitlements.data;

  if (entitlements.isError && !data) {
    return (
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
    );
  }

  return (
    <HomePanel>
      <PlanUsage
        plan={data?.plan.name}
        limits={data ? planLimits(data) : []}
        status={queryStatus(entitlements)}
      />
    </HomePanel>
  );
}

export default function HomeContainer() {
  const session = useSessionQuery();
  const overview = useCrmOverviewQuery();
  const data = overview.data;
  const status = queryStatus(overview);

  if (overview.isError && !data) {
    return (
      <div className="@container flex w-full flex-col gap-8">
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="Your dashboard didn't load"
          description="Something went wrong on our side. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => overview.refetch()}>
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
        <YourPlan />
      </div>
    );
  }

  return (
    <div className="@container flex w-full flex-col gap-8">
      <WelcomeHero
        name={session.data?.user.name}
        now={data?.now}
        stages={data?.stages}
        wonThisWeek={data?.wonThisWeek}
      />
      <DealStats metrics={data?.metrics ?? []} status={status} />
      <div className="grid items-start gap-6 @5xl:grid-cols-3">
        <div className="flex flex-col gap-6 @5xl:col-span-2">
          <HomePanel>
            <QuotaPaceCard quota={data?.quota} status={status} />
          </HomePanel>
          <HomePanel>
            <TopPerformers reps={data?.reps ?? []} status={status} />
          </HomePanel>
        </div>
        <div className="flex flex-col gap-6">
          <HomePanel>
            <FollowUps
              groups={data?.followUps ?? []}
              now={data?.now}
              timeZone={TIME_ZONE}
              status={status}
            />
          </HomePanel>
          <YourPlan />
        </div>
      </div>
    </div>
  );
}
