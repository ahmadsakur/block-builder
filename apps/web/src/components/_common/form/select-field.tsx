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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";

export type SelectOption = { value: string; label: string };

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  description?: ReactNode;
};

export default function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  description,
}: SelectFieldProps<T>) {
  const id = useId();
  const items = Object.fromEntries(
    options.map((option) => [option.value, option.label]),
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            items={items}
            name={field.name}
            value={field.value ?? null}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={id}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
