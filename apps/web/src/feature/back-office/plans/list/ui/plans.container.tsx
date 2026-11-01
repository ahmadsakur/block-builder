"use client";

import { PERMISSION_KEYS } from "@block-builder/shared/entitlements";
import { CloudAlertIcon, RotateCwIcon, SearchXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { usePlansQuery } from "@/feature/back-office/_shared/query/plans.query";
import { useDeletePlan, useSavePlan } from "../../_shared/query/plans.query";
import type { PlanInput, PlanRow } from "../../_shared/types/plans.types";
import DeletePlanDialog from "../../_shared/ui/delete-plan-dialog";
import PlanDialog from "../../_shared/ui/form/plan-dialog";
import { describePlans } from "../logic/plan-list.logic";
import PlansHeader from "./components/header/plans-header";
import PlansSkeleton from "./components/plans-skeleton";
import { RowActionsContext } from "./components/table/plan-row-actions";
import PlansTable from "./components/table/plans-table";

type Target = { open: boolean; plan?: PlanRow };

export default function PlansContainer() {
  const router = useRouter();
  const plans = usePlansQuery();
  const save = useSavePlan();
  const remove = useDeletePlan();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<Target>({ open: false });
  const [deleting, setDeleting] = useState<Target>({ open: false });

  if (plans.isError) {
    return (
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
    );
  }

  if (!plans.data) return <PlansSkeleton />;
  const rows = plans.data;

  const openDialog = (plan?: PlanRow) => {
    save.reset();
    setDialog({ open: true, plan });
  };

  const openDelete = (plan: PlanRow) => {
    remove.reset();
    setDeleting({ open: true, plan });
  };

  const submit = (input: PlanInput) => {
    const id = dialog.plan?.id;
    save.mutate(
      { id, input },
      {
        onSuccess: (saved) => {
          setDialog((current) => ({ ...current, open: false }));
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

  const confirmDelete = () => {
    const plan = deleting.plan;
    if (!plan) return;
    remove.mutate(plan.id, {
      onSuccess: () => {
        setDeleting((current) => ({ ...current, open: false }));
        toast.success(`${plan.name} deleted`);
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <PlansHeader
        description={describePlans(rows)}
        search={search}
        onSearch={setSearch}
        onCreate={() => openDialog()}
      />
      <RowActionsContext value={{ onDelete: openDelete, onEdit: openDialog }}>
        <PlansTable
          plans={rows}
          permissionCount={PERMISSION_KEYS.length}
          search={search}
          empty={
            <EmptyState
              icon={<SearchXIcon />}
              title="No matches"
              description={`No plan name contains “${search}”.`}
              action={
                <Button variant="outline" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              }
            />
          }
        />
      </RowActionsContext>
      <PlanDialog
        open={dialog.open}
        plan={dialog.plan}
        pending={save.isPending}
        error={save.error?.message}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
        onSubmit={submit}
      />
      <DeletePlanDialog
        open={deleting.open}
        name={deleting.plan?.name}
        pending={remove.isPending}
        error={remove.error?.message}
        onOpenChange={(open) =>
          setDeleting((current) => ({ ...current, open }))
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
