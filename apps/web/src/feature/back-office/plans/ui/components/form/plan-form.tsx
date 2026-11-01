"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type Plan,
  type PlanInput,
  planInputSchema,
} from "../../../types/plans.types";

export function planFormCopy(plan?: Plan) {
  return plan
    ? {
        cta: "Save changes",
        description:
          "Renaming a plan doesn't change its permissions or its users.",
        pending: "Saving…",
        title: `Edit ${plan.name}`,
      }
    : {
        cta: "Create plan",
        description:
          "A new plan starts with every permission off. Pick what it includes next.",
        pending: "Creating…",
        title: "New plan",
      };
}

type PlanFormProps = {
  plan?: Plan;
  pending: boolean;
  error?: string;
  onSubmit: (values: PlanInput) => void;
  onCancel: () => void;
};

export default function PlanForm({
  plan,
  pending,
  error,
  onSubmit,
  onCancel,
}: PlanFormProps) {
  const copy = planFormCopy(plan);
  const form = useForm<PlanInput>({
    resolver: zodResolver(planInputSchema),
    defaultValues: {
      description: plan?.description ?? "",
      name: plan?.name ?? "",
    },
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
          {pending ? copy.pending : copy.cta}
        </Button>
      </div>
    </form>
  );
}
