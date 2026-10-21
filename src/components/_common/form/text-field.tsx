"use client";

import { type ReactNode, useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  description?: ReactNode;
  labelAction?: ReactNode;
};

export default function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  description,
  labelAction,
}: TextFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {labelAction}
          </div>
          <Input
            {...field}
            id={id}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
