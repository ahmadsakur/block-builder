"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import type { Customer, CustomerInput } from "../../../types/customers.types";
import CustomerForm, { customerFormCopy } from "./customer-form";

type CustomerSheetProps = {
  open: boolean;
  customer?: Customer;
  pending: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CustomerInput) => void;
};

export default function CustomerSheet({
  open,
  customer,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: CustomerSheetProps) {
  const copy = customerFormCopy(customer);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{copy.title}</SheetTitle>
          <SheetDescription>{copy.description}</SheetDescription>
        </SheetHeader>
        <CustomerForm
          key={customer?.id ?? "new"}
          customer={customer}
          pending={pending}
          error={error}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
