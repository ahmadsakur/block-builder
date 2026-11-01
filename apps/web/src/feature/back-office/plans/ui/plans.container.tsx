"use client";

import { CloudAlertIcon, PlusIcon, RotateCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { usePlansQuery } from "@/feature/back-office/_shared/query/plans.query";
import { queryStatus } from "@/lib/query-status";
import { useSavePlan } from "../query/plans.query";
import type { PlanInput, PlanRow } from "../types/plans.types";
import PlanDialog from "./components/form/plan-dialog";
import PlansTable from "./components/plans-table";

type Target = { open: boolean; plan?: PlanRow };

export default function PlansContainer() {
  const router = useRouter();
  const plans = usePlansQuery();
  const save = useSavePlan();
  const [editing, setEditing] = useState<Target>({ open: false });
  const status = queryStatus(plans);

  const openEditor = (plan?: PlanRow) => {
    save.reset();
    setEditing({ open: true, plan });
  };

  const submit = (input: PlanInput) => {
    const id = editing.plan?.id;
    save.mutate(
      { id, input },
      {
        onSuccess: (saved) => {
          setEditing((current) => ({ ...current, open: false }));
          if (id) {
            toast.success(`${saved.name} saved`);
            return;
          }
          toast.success(`${saved.name} created`);
          router.push(`/back-office/plans/${saved.id}`);
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
            Every user is on one plan. Open a plan to choose what it includes.
          </p>
        </div>
        <Button onClick={() => openEditor()}>
          <PlusIcon />
          New plan
        </Button>
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
        pending={save.isPending}
        error={save.error?.message}
        onOpenChange={(open) => setEditing((current) => ({ ...current, open }))}
        onSubmit={submit}
      />
    </div>
  );
}
