"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectField from "@/components/_common/form/select-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type ManagedUser,
  PLAN_IDS,
  type PlanId,
  type UserPlanInput,
  userPlanSchema,
} from "../../../types/users.types";

type UserPlanFormProps = {
  user: ManagedUser;
  planName: (id: PlanId) => string;
  pending: boolean;
  error?: string;
  onSubmit: (values: UserPlanInput) => void;
  onCancel: () => void;
};

export default function UserPlanForm({
  user,
  planName,
  pending,
  error,
  onSubmit,
  onCancel,
}: UserPlanFormProps) {
  const form = useForm<UserPlanInput>({
    resolver: zodResolver(userPlanSchema),
    defaultValues: { plan: user.plan },
  });
  const options = PLAN_IDS.map((plan) => ({
    label: planName(plan),
    value: plan,
  }));

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <SelectField
          control={form.control}
          name="plan"
          label="Plan"
          options={options}
          description="The new plan's permissions apply on the user's next request."
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Change plan"}
        </Button>
      </div>
    </form>
  );
}
