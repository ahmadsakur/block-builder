"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FieldError } from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import { Switch } from "@/components/_ui/switch";
import { FormSection, SaveBar } from "@/components/dashboardblocks/forms";
import {
  changedKeys,
  dependencyHint,
  parseLimit,
  rowIndex,
  toEntitlements,
  togglePermission,
  toRows,
} from "../../../logic/plan-detail.logic";
import {
  type Entitlements,
  FEATURES,
  type PermissionKey,
  type PlanPermissionsFormInput,
  planPermissionsFormSchema,
} from "../../../types/plan-detail.types";

type PlanPermissionsFormProps = {
  entitlements: Entitlements;
  pending: boolean;
  error?: string;
  onSubmit: (entitlements: Entitlements) => void;
};

export default function PlanPermissionsForm({
  entitlements,
  pending,
  error,
  onSubmit,
}: PlanPermissionsFormProps) {
  const form = useForm<PlanPermissionsFormInput>({
    resolver: zodResolver(planPermissionsFormSchema),
    defaultValues: { permissions: toRows(entitlements) },
  });
  const rows = useWatch({ control: form.control, name: "permissions" });
  const draft = toEntitlements(rows);
  const changes = changedKeys(entitlements, draft);

  const toggle = (key: PermissionKey, enabled: boolean) =>
    form.setValue(
      "permissions",
      toRows(togglePermission(draft, key, enabled)),
      { shouldDirty: true },
    );

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSubmit(toEntitlements(values.permissions)),
      )}
      className="flex flex-col gap-6"
    >
      {FEATURES.map((feature) => (
        <FormSection
          key={feature.key}
          title={feature.label}
          description={feature.description}
        >
          <ul className="flex flex-col divide-y">
            {feature.permissions.map((permission) => {
              const index = rowIndex(permission.key);
              const enabled = draft[permission.key].enabled;
              const hint = dependencyHint(permission.key);
              const limitError =
                form.formState.errors.permissions?.[index]?.limit?.message;
              return (
                <li
                  key={permission.key}
                  className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {permission.label}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {permission.description}
                    </span>
                    {hint && (
                      <span className="text-muted-foreground text-xs">
                        {hint}
                      </span>
                    )}
                    {limitError && <FieldError>{limitError}</FieldError>}
                  </div>
                  <div className="flex items-center gap-3">
                    {permission.kind === "limit" && (
                      <Controller
                        control={form.control}
                        name={`permissions.${index}.limit`}
                        render={({ field, fieldState }) => (
                          <Input
                            aria-label={`${permission.label} limit`}
                            aria-invalid={fieldState.invalid}
                            className="h-8 w-28 text-end tabular-nums"
                            disabled={!enabled}
                            inputMode="numeric"
                            min={0}
                            name={field.name}
                            placeholder="Unlimited"
                            ref={field.ref}
                            type="number"
                            value={field.value ?? ""}
                            onBlur={field.onBlur}
                            onChange={(event) =>
                              field.onChange(parseLimit(event.target.value))
                            }
                          />
                        )}
                      />
                    )}
                    <Switch
                      aria-label={permission.label}
                      checked={enabled}
                      onCheckedChange={(next) => toggle(permission.key, next)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </FormSection>
      ))}
      {error && <FieldError>{error}</FieldError>}
      <SaveBar
        isDirty={changes.length > 0}
        isSubmitting={pending}
        message={`${changes.length} unsaved ${changes.length === 1 ? "change" : "changes"}`}
        onDiscard={() => form.reset({ permissions: toRows(entitlements) })}
      />
    </form>
  );
}
