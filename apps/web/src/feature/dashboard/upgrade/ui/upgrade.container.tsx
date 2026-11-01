"use client";

import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import {
  useEntitlementsQuery,
  usePlansQuery,
} from "@/feature/dashboard/_shared/query/entitlements.query";
import {
  lockedNotice,
  planFeatures,
  planFor,
  sortPlans,
} from "../logic/upgrade.logic";
import { useUpgradeParams } from "../query/upgrade.query";
import LockedNotice from "./components/locked-notice";
import PlanCard from "./components/plans/plan-card";
import PlansSkeleton from "./components/plans-skeleton";

export default function UpgradeContainer() {
  const [{ permission }] = useUpgradeParams();
  const plans = usePlansQuery();
  const mine = useEntitlementsQuery();
  const currentId = mine.data?.plan.id;
  const failed = (plans.isError && !plans.data) || (mine.isError && !mine.data);
  const list = plans.data && mine.data ? sortPlans(plans.data) : undefined;
  const recommended =
    permission && list ? planFor(list, currentId, permission) : undefined;

  return (
    <div className="@container flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Upgrade</h1>
        <p className="text-muted-foreground">
          Compare what each plan includes. There's no checkout: an admin moves
          your account between plans.
        </p>
      </header>
      {failed ? (
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="Plans didn't load"
          description="We couldn't reach the plan list. Check your connection and try again."
          action={
            <Button
              variant="outline"
              onClick={() => {
                plans.refetch();
                mine.refetch();
              }}
            >
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
      ) : !list ? (
        <PlansSkeleton />
      ) : (
        <>
          {permission && (
            <LockedNotice notice={lockedNotice(list, currentId, permission)} />
          )}
          <div className="grid gap-4 @2xl:grid-cols-2">
            {list.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                features={planFeatures(plan)}
                current={plan.id === currentId}
                recommended={plan.id === recommended?.id}
                focus={permission ?? undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
