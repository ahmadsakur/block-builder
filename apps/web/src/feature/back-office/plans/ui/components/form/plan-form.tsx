"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type Plan,
  type PlanUpdateInput,
  planUpdateSchema,
} from "../../../types/plans.types";

type PlanFormProps = {
  plan: Plan;
  pending: boolean;
  error?: string;
  onSubmit: (values: PlanUpdateInput) => void;
  onCancel: () => void;
};

export default function PlanForm({
  plan,
  pending,
  error,
  onSubmit,
  onCancel,
}: PlanFormProps) {
  const form = useForm<PlanUpdateInput>({
    resolver: zodResolver(planUpdateSchema),
    defaultValues: { description: plan.description, name: plan.name },
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <TextField control={form.control} name="name" label="Name" />
        <TextField
          control={form.control}
          name="description"
          label="Description"
          description="Users see this on the upgrade page."
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
