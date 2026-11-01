"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import { planName } from "@/feature/back-office/_shared/logic/plans.logic";
import type {
  ManagedUser,
  Plan,
  UserPlanInput,
} from "../../../types/users.types";
import UserPlanForm from "./user-plan-form";

type UserPlanDialogProps = {
  open: boolean;
  user?: ManagedUser;
  plans: readonly Plan[];
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserPlanInput) => void;
};

export default function UserPlanDialog({
  open,
  user,
  plans,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: UserPlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
          <DialogDescription>
            {user
              ? `${user.name} (${user.email}) is on ${planName(plans, user.plan)}.`
              : "Pick the plan for this user."}
          </DialogDescription>
        </DialogHeader>
        {user && (
          <UserPlanForm
            key={user.id}
            user={user}
            plans={plans}
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
