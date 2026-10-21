"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "../../../_shared/types/auth.types";

type ForgotPasswordFormProps = {
  pending: boolean;
  error?: string;
  onSubmit: (values: ForgotPasswordInput) => void;
};

export default function ForgotPasswordForm({
  pending,
  error,
  onSubmit,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Sending link…" : "Send reset link"}
        </Button>
      </FieldGroup>
    </form>
  );
}
