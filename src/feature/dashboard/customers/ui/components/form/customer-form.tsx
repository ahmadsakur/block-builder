"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectField from "@/components/_common/form/select-field";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import { toCustomerInput } from "../../../logic/customers.logic";
import {
  CUSTOMER_PLANS,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerInput,
  customerInputSchema,
} from "../../../types/customers.types";

const EMPTY_CUSTOMER: CustomerInput = {
  company: "",
  email: "",
  plan: "Pro",
  seats: 5,
  status: "trial",
};

const PLAN_OPTIONS = CUSTOMER_PLANS.map((plan) => ({
  label: plan,
  value: plan,
}));

const STATUS_OPTIONS = CUSTOMER_STATUSES.map((status) => ({
  label: CUSTOMER_STATUS_LABEL[status],
  value: status,
}));

export function customerFormCopy(customer?: Customer) {
  return customer
    ? {
        description: "Changes apply as soon as you save.",
        pending: "Saving…",
        submit: "Save changes",
        title: `Edit ${customer.company}`,
      }
    : {
        description: "Add an account to the workspace.",
        pending: "Creating…",
        submit: "Create customer",
        title: "New customer",
      };
}

type CustomerFormProps = {
  customer?: Customer;
  pending: boolean;
  error?: string;
  onSubmit: (values: CustomerInput) => void;
  onCancel: () => void;
};

export default function CustomerForm({
  customer,
  pending,
  error,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const copy = customerFormCopy(customer);
  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerInputSchema),
    defaultValues: customer ? toCustomerInput(customer) : EMPTY_CUSTOMER,
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <FieldGroup className="flex-1 overflow-y-auto p-4">
        <TextField
          control={form.control}
          name="company"
          label="Company"
          autoComplete="organization"
        />
        <TextField
          control={form.control}
          name="email"
          label="Billing email"
          type="email"
          autoComplete="email"
        />
        <SelectField
          control={form.control}
          name="plan"
          label="Plan"
          options={PLAN_OPTIONS}
        />
        <TextField
          control={form.control}
          name="seats"
          label="Seats"
          type="number"
        />
        <SelectField
          control={form.control}
          name="status"
          label="Status"
          options={STATUS_OPTIONS}
          description="Trial and churned accounts don't count toward MRR."
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldGroup>
      <div className="flex justify-end gap-2 border-t p-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? copy.pending : copy.submit}
        </Button>
      </div>
    </form>
  );
}
