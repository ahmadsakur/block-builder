"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Checkbox } from "@/components/_ui/checkbox";
import { FieldError } from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import { SaveBar } from "@/components/dashboardblocks/forms";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableGroupHead,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableRowHead,
} from "@/components/dashboardblocks/table";
import { cn } from "@/lib/utils";
import {
  cellIndex,
  changedCells,
  parseLimit,
} from "../../logic/permissions.logic";
import {
  FEATURES,
  type PermissionCell,
  type PermissionMatrixInput,
  type Plan,
  permissionMatrixFormSchema,
} from "../../types/permissions.types";

const TITLE = "Permissions by plan";

type PermissionMatrixProps = {
  plans: Plan[];
  cells: PermissionCell[];
  pending: boolean;
  error?: string;
  onSubmit: (changed: PermissionCell[]) => void;
};

export default function PermissionMatrix({
  plans,
  cells,
  pending,
  error,
  onSubmit,
}: PermissionMatrixProps) {
  const form = useForm<PermissionMatrixInput>({
    resolver: zodResolver(permissionMatrixFormSchema),
    defaultValues: { cells },
  });
  const draft = useWatch({ control: form.control, name: "cells" });
  const changes = changedCells(cells, draft);
  const invalid = form.formState.errors.cells;
  const firstError = Array.isArray(invalid)
    ? invalid.find(Boolean)?.limit?.message
    : undefined;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSubmit(changedCells(cells, values.cells)),
      )}
      className="flex flex-col gap-3"
    >
      <section className="@container/data-table">
        <DataTable className="border-t" caption={TITLE}>
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead className="min-w-48">
                <span className="sr-only">Permission</span>
              </DataTableHead>
              {plans.map((plan) => (
                <DataTableHead
                  key={plan.id}
                  align="center"
                  className="text-foreground min-w-36 py-2.5 text-sm"
                >
                  {plan.name}
                </DataTableHead>
              ))}
            </DataTableRow>
          </DataTableHeader>
          {FEATURES.map((feature) => (
            <DataTableBody key={feature.key}>
              <DataTableRow>
                <DataTableGroupHead colSpan={plans.length + 1}>
                  {feature.label}
                </DataTableGroupHead>
              </DataTableRow>
              {feature.permissions.map((permission) => (
                <DataTableRow key={permission.key}>
                  <DataTableRowHead>
                    <span className="block">{permission.label}</span>
                    <span className="text-muted-foreground block text-xs">
                      {permission.description}
                    </span>
                  </DataTableRowHead>
                  {plans.map((plan) => {
                    const index = cellIndex(cells, plan.id, permission.key);
                    const changed = changes.some(
                      (cell) =>
                        cell.planId === plan.id && cell.key === permission.key,
                    );
                    const label = `${plan.name}: ${permission.label}`;
                    return (
                      <DataTableCell
                        key={plan.id}
                        align="center"
                        className={cn(changed && "bg-primary/5")}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Controller
                            control={form.control}
                            name={`cells.${index}.enabled`}
                            render={({ field }) => (
                              <Checkbox
                                aria-label={`${label}, allowed`}
                                checked={field.value}
                                onCheckedChange={(next) =>
                                  field.onChange(next === true)
                                }
                              />
                            )}
                          />
                          {permission.kind === "limit" && (
                            <Controller
                              control={form.control}
                              name={`cells.${index}.limit`}
                              render={({ field, fieldState }) => (
                                <Input
                                  aria-label={`${label}, limit`}
                                  aria-invalid={fieldState.invalid}
                                  className="h-8 w-24 text-end tabular-nums"
                                  disabled={!draft[index]?.enabled}
                                  inputMode="numeric"
                                  min={0}
                                  name={field.name}
                                  placeholder="Unlimited"
                                  ref={field.ref}
                                  type="number"
                                  value={field.value ?? ""}
                                  onBlur={field.onBlur}
                                  onChange={(event) =>
                                    field.onChange(
                                      parseLimit(event.target.value),
                                    )
                                  }
                                />
                              )}
                            />
                          )}
                        </span>
                      </DataTableCell>
                    );
                  })}
                </DataTableRow>
              ))}
            </DataTableBody>
          ))}
        </DataTable>
      </section>
      {firstError && <FieldError>{firstError}</FieldError>}
      {error && <FieldError>{error}</FieldError>}
      <SaveBar
        className="mt-1"
        isDirty={changes.length > 0}
        isSubmitting={pending}
        message={`${changes.length} unsaved ${changes.length === 1 ? "change" : "changes"}`}
        onDiscard={() => form.reset({ cells })}
      />
    </form>
  );
}
