"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type SignUpInput,
  signUpSchema,
} from "../../../_shared/types/auth.types";

type SignUpFormProps = {
  pending: boolean;
  error?: string;
  onSubmit: (values: SignUpInput) => void;
};

export default function SignUpForm({
  pending,
  error,
  onSubmit,
}: SignUpFormProps) {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <TextField
          control={form.control}
          name="name"
          label="Name"
          autoComplete="name"
        />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        <TextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          description="At least 8 characters."
        />
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
