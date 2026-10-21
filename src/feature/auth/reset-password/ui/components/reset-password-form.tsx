"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from "../../../_shared/types/auth.types";

type ResetPasswordFormProps = {
  pending: boolean;
  error?: string;
  onSubmit: (values: ResetPasswordInput) => void;
};

export default function ResetPasswordForm({
  pending,
  error,
  onSubmit,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <TextField
          control={form.control}
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          description="At least 8 characters."
        />
        <TextField
          control={form.control}
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
        />
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Set new password"}
        </Button>
      </FieldGroup>
    </form>
  );
}
