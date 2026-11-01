"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type SignInInput,
  signInSchema,
} from "../../../_shared/types/auth.types";
import AuthLink from "../../../_shared/ui/auth-link";

type SignInFormProps = {
  pending: boolean;
  error?: string;
  onSubmit: (values: SignInInput) => void;
};

export default function SignInForm({
  pending,
  error,
  onSubmit,
}: SignInFormProps) {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
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
        <TextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          labelAction={
            <AuthLink href="/forgot-password" quiet>
              Forgot password?
            </AuthLink>
          }
        />
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
