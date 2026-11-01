"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import type { Plan, PlanInput } from "../../types/plans.types";
import PlanForm, { planFormCopy } from "./plan-form";

type PlanDialogProps = {
  open: boolean;
  plan?: Pick<Plan, "description" | "id" | "name">;
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlanInput) => void;
};

export default function PlanDialog({
  open,
  plan,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: PlanDialogProps) {
  const copy = planFormCopy(plan);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <PlanForm
          key={plan?.id ?? "new"}
          plan={plan}
          pending={pending}
          error={error}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
