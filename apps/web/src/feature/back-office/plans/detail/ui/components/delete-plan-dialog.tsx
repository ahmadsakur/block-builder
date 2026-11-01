"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/_ui/alert-dialog";
import { Button } from "@/components/_ui/button";
import { FieldError } from "@/components/_ui/field";

type DeletePlanDialogProps = {
  open: boolean;
  name: string;
  members: number;
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function DeletePlanDialog({
  open,
  name,
  members,
  pending,
  error,
  onOpenChange,
  onConfirm,
}: DeletePlanDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {members > 0
              ? `Its ${members} ${members === 1 ? "user moves" : "users move"} to the default plan. `
              : ""}
            You can't undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <FieldError>{error}</FieldError>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending ? "Deleting…" : "Delete plan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
