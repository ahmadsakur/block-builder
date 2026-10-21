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
import type { Customer } from "../../types/customers.types";

type DeleteCustomerDialogProps = {
  open: boolean;
  customer?: Customer;
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function DeleteCustomerDialog({
  open,
  customer,
  pending,
  error,
  onOpenChange,
  onConfirm,
}: DeleteCustomerDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {customer?.company}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the customer and their billing history. You can't undo
            this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <FieldError>{error}</FieldError>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending ? "Deleting…" : "Delete customer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
