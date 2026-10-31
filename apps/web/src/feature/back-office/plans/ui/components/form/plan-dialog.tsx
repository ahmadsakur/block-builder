"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import type { Plan, PlanUpdateInput } from "../../../types/plans.types";
import PlanForm from "./plan-form";

type PlanDialogProps = {
  open: boolean;
  plan?: Plan;
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlanUpdateInput) => void;
};

export default function PlanDialog({
  open,
  plan,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: PlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{plan ? `Edit ${plan.name}` : "Edit plan"}</DialogTitle>
          <DialogDescription>
            Renaming a plan doesn't change its permissions or its users.
          </DialogDescription>
        </DialogHeader>
        {plan && (
          <PlanForm
            key={plan.id}
            plan={plan}
            pending={pending}
            error={error}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
