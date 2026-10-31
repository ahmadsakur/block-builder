"use client";

import { CloudAlertIcon, RotateCwIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button, buttonVariants } from "@/components/_ui/button";
import { usePlansQuery } from "@/feature/back-office/_shared/query/plans.query";
import { queryStatus } from "@/lib/query-status";
import { useUpdatePlan } from "../query/plans.query";
import type { PlanSummary, PlanUpdateInput } from "../types/plans.types";
import PlanDialog from "./components/form/plan-dialog";
import PlansTable from "./components/plans-table";

type Target = { open: boolean; plan?: PlanSummary };

export default function PlansContainer() {
  const plans = usePlansQuery();
  const update = useUpdatePlan();
  const [editing, setEditing] = useState<Target>({ open: false });
  const status = queryStatus(plans);

  const openEditor = (plan: PlanSummary) => {
    update.reset();
    setEditing({ open: true, plan });
  };

  const submit = (input: PlanUpdateInput) => {
    const plan = editing.plan;
    if (!plan) return;
    update.mutate(
      { id: plan.id, input },
      {
        onSuccess: (saved) => {
          setEditing((current) => ({ ...current, open: false }));
          toast.success(`${saved.name} saved`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Every user is on one plan. What a plan allows is set under
            Permissions.
          </p>
        </div>
        <Link
          href="/back-office/permissions"
          className={buttonVariants({ variant: "outline" })}
        >
          <ShieldCheckIcon />
          Edit permissions
        </Link>
      </header>
      {status === "error" ? (
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="Plans didn't load"
          description="Something went wrong on our side. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => plans.refetch()}>
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
      ) : (
        <PlansTable
          plans={plans.data ?? []}
          status={status}
          onEdit={openEditor}
        />
      )}
      <PlanDialog
        open={editing.open}
        plan={editing.plan}
        pending={update.isPending}
        error={update.error?.message}
        onOpenChange={(open) => setEditing((current) => ({ ...current, open }))}
        onSubmit={submit}
      />
    </div>
  );
}
