"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextField from "@/components/_common/form/text-field";
import { Button, buttonVariants } from "@/components/_ui/button";
import { FieldError, FieldGroup } from "@/components/_ui/field";
import type { PermissionKey } from "@/feature/dashboard/_shared/types/entitlements.types";
import { upgradeHref } from "@/lib/auth/routes";
import {
  type ProjectInput,
  projectInputSchema,
} from "../../../types/projects.types";

const EMPTY_PROJECT: ProjectInput = { name: "" };

type ProjectFormProps = {
  pending: boolean;
  error?: string;
  upgrade?: PermissionKey;
  onSubmit: (values: ProjectInput) => void;
  onCancel: () => void;
};

export default function ProjectForm({
  pending,
  error,
  upgrade,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: EMPTY_PROJECT,
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <TextField
          control={form.control}
          name="name"
          label="Project name"
          autoComplete="off"
        />
        {error && (
          <div className="flex flex-col items-start gap-3">
            <FieldError>{error}</FieldError>
            {upgrade && (
              <Link
                href={upgradeHref(upgrade)}
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                See plans
              </Link>
            )}
          </div>
        )}
      </FieldGroup>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
