"use client";

import { CloudAlertIcon, RotateCwIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button, buttonVariants } from "@/components/_ui/button";
import { FieldError } from "@/components/_ui/field";
import { SaveBar } from "@/components/dashboardblocks/forms";
import { ApiError } from "@/lib/api";
import { pluralize } from "../../_shared/logic/plans.logic";
import { useDeletePlan, useSavePlan } from "../../_shared/query/plans.query";
import type { PlanInput } from "../../_shared/types/plans.types";
import DeletePlanDialog from "../../_shared/ui/delete-plan-dialog";
import PlanDialog from "../../_shared/ui/form/plan-dialog";
import {
  changedPermissions,
  firstLimitError,
} from "../logic/permissions.logic";
import { planFacts } from "../logic/plan.logic";
import {
  usePlanQuery,
  useSavePlanPermissions,
} from "../query/plan-detail.query";
import type { Entitlements, PlanId } from "../types/plan-detail.types";
import PlanHeader from "./components/header/plan-header";
import PermissionTable from "./components/permissions/permission-table";
import PlanDetailSkeleton from "./components/plan-detail-skeleton";

const PLANS_HREF = "/back-office/plans";

export default function PlanDetailContainer({ planId }: { planId: PlanId }) {
  const router = useRouter();
  const plan = usePlanQuery(planId);
  const savePermissions = useSavePlanPermissions(planId);
  const savePlan = useSavePlan();
  const remove = useDeletePlan();
  const [draft, setDraft] = useState<Entitlements | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (plan.isError) {
    const missing = plan.error instanceof ApiError && plan.error.status === 404;
    return missing ? (
      <EmptyState
        bordered
        icon={<SearchXIcon />}
        title="This plan doesn't exist"
        description="It may have been deleted. Pick another plan from the list."
        action={
          <Link
            href={PLANS_HREF}
            className={buttonVariants({ variant: "outline" })}
          >
            All plans
          </Link>
        }
      />
    ) : (
      <EmptyState
        bordered
        tone="error"
        icon={<CloudAlertIcon />}
        title="This plan didn't load"
        description="Something went wrong on our side. Try again in a moment."
        action={
          <Button variant="outline" onClick={() => plan.refetch()}>
            <RotateCwIcon />
            Try again
          </Button>
        }
      />
    );
  }

  if (!plan.data) return <PlanDetailSkeleton />;
  const detail = plan.data;
  const saved = detail.entitlements;
  const current = draft ?? saved;
  const changed = changedPermissions(current, saved);

  const change = (next: Entitlements) => {
    setInvalid(null);
    setDraft(next);
  };

  const save = () => {
    const error = firstLimitError(current);
    if (error) {
      setInvalid(error);
      return;
    }
    savePermissions.mutate(current, {
      onSuccess: (next) => {
        setDraft(null);
        toast.success(`${next.name} permissions saved`);
      },
    });
  };

  const discard = () => {
    setInvalid(null);
    savePermissions.reset();
    setDraft(null);
  };

  const submitDetails = (input: PlanInput) =>
    savePlan.mutate(
      { id: detail.id, input },
      {
        onSuccess: (next) => {
          setEditing(false);
          toast.success(`${next.name} saved`);
        },
      },
    );

  const confirmDelete = () =>
    remove.mutate(detail.id, {
      onSuccess: () => {
        setDeleting(false);
        toast.success(`${detail.name} deleted`);
        router.push(PLANS_HREF);
      },
    });

  return (
    <div className="@container flex w-full flex-col gap-8">
      <PlanHeader
        plan={detail}
        facts={planFacts(detail, current)}
        onEdit={() => {
          savePlan.reset();
          setEditing(true);
        }}
        onDelete={() => {
          remove.reset();
          setDeleting(true);
        }}
      />
      <form
        noValidate
        className="@container/permissions flex min-w-0 flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-medium">Permissions</h2>
          <p className="text-muted-foreground text-xs text-pretty">
            Tick what this plan includes and set its limits; leave a limit empty
            for unlimited. A permission brings along the ones it needs; nothing
            changes until you save.
          </p>
        </div>
        <PermissionTable
          changed={changed}
          entitlements={current}
          planName={detail.name}
          onChange={change}
        />
        {(invalid ?? savePermissions.error?.message) && (
          <FieldError>{invalid ?? savePermissions.error?.message}</FieldError>
        )}
        <SaveBar
          className="mt-2"
          isDirty={changed.size > 0}
          isSubmitting={savePermissions.isPending}
          message={pluralize(changed.size, "unsaved change")}
          saveLabel="Save permissions"
          onDiscard={discard}
        />
      </form>
      <PlanDialog
        open={editing}
        plan={detail}
        pending={savePlan.isPending}
        error={savePlan.error?.message}
        onOpenChange={setEditing}
        onSubmit={submitDetails}
      />
      <DeletePlanDialog
        open={deleting}
        name={detail.name}
        pending={remove.isPending}
        error={remove.error?.message}
        onOpenChange={setDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
