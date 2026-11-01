"use client";

import {
  ArrowLeftIcon,
  CloudAlertIcon,
  RotateCwIcon,
  SearchXIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button, buttonVariants } from "@/components/_ui/button";
import { FormSection } from "@/components/dashboardblocks/forms";
import { Tag } from "@/components/dashboardblocks/tag";
import { ApiError } from "@/lib/api";
import {
  useDeletePlan,
  usePlanQuery,
  useSavePlanPermissions,
} from "../query/plan-detail.query";
import type { Entitlements, PlanId } from "../types/plan-detail.types";
import DeletePlanDialog from "./components/delete-plan-dialog";
import PlanPermissionsForm from "./components/permissions/plan-permissions-form";
import PlanDetailSkeleton from "./components/plan-detail-skeleton";

const PLANS_HREF = "/back-office/plans";

export default function PlanDetailContainer({ planId }: { planId: PlanId }) {
  const router = useRouter();
  const plan = usePlanQuery(planId);
  const save = useSavePlanPermissions(planId);
  const remove = useDeletePlan(planId);
  const [confirming, setConfirming] = useState(false);

  const back = (
    <Link
      href={PLANS_HREF}
      className={buttonVariants({ size: "sm", variant: "ghost" })}
    >
      <ArrowLeftIcon />
      Plans
    </Link>
  );

  if (plan.isError) {
    const missing = plan.error instanceof ApiError && plan.error.status === 404;
    return (
      <div className="flex w-full flex-col gap-6">
        <div>{back}</div>
        {missing ? (
          <EmptyState
            bordered
            icon={<SearchXIcon />}
            title="This plan doesn't exist"
            description="It may have been deleted. Pick another plan from the list."
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
        )}
      </div>
    );
  }

  if (!plan.data) return <PlanDetailSkeleton />;
  const detail = plan.data;

  const submit = (entitlements: Entitlements) =>
    save.mutate(entitlements, {
      onSuccess: (saved) => toast.success(`${saved.name} permissions saved`),
    });

  const openDelete = () => {
    remove.reset();
    setConfirming(true);
  };

  const confirmDelete = () =>
    remove.mutate(undefined, {
      onSuccess: () => {
        setConfirming(false);
        toast.success(`${detail.name} deleted`);
        router.push(PLANS_HREF);
      },
    });

  return (
    <div className="flex w-full flex-col gap-6">
      <div>{back}</div>
      <header className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          {detail.name}
          {detail.isDefault && <Tag>Default</Tag>}
        </h1>
        <p className="text-muted-foreground">
          {detail.description || "No description"}
          {" · "}
          <Link
            href={`/back-office/users?plan=${detail.id}`}
            className="underline-offset-4 hover:underline"
          >
            {detail.members} {detail.members === 1 ? "user" : "users"}
          </Link>
        </p>
      </header>
      <PlanPermissionsForm
        key={plan.dataUpdatedAt}
        entitlements={detail.entitlements}
        pending={save.isPending}
        error={save.error?.message}
        onSubmit={submit}
      />
      <FormSection
        title="Delete plan"
        description={
          detail.isDefault
            ? "New sign-ups join the default plan, so it can't be deleted."
            : "Its users move to the default plan."
        }
      >
        <Button
          variant="destructive"
          disabled={detail.isDefault}
          onClick={openDelete}
        >
          Delete {detail.name}
        </Button>
      </FormSection>
      <DeletePlanDialog
        open={confirming}
        name={detail.name}
        members={detail.members}
        pending={remove.isPending}
        error={remove.error?.message}
        onOpenChange={setConfirming}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
