"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import {
  type AuthUser,
  type ProfileInput,
  profileSchema,
} from "../../types/profile.types";

type ProfileFormProps = {
  user: AuthUser;
  avatar?: ReactNode;
  pending: boolean;
  error?: string;
  onSubmit: (values: ProfileInput) => void;
};

export default function ProfileForm({
  user,
  avatar,
  pending,
  error,
  onSubmit,
}: ProfileFormProps) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user.email, name: user.name },
  });
  const name = useWatch({ control: form.control, name: "name" });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex items-center gap-4">
          {avatar}
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{name || user.name}</span>
            <span className="text-muted-foreground truncate text-sm">
              {user.email}
            </span>
          </div>
        </div>
        <TextField
          control={form.control}
          name="name"
          label="Full name"
          autoComplete="name"
        />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          description="We send sign-in links and receipts here."
        />
        {error && <FieldError>{error}</FieldError>}
        <div className="flex gap-2">
          <Button type="submit" disabled={pending || !form.formState.isDirty}>
            {pending ? "Saving…" : "Save profile"}
          </Button>
          {form.formState.isDirty && (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => form.reset()}
            >
              Discard
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
