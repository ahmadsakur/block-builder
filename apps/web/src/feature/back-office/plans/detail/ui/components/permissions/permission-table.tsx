"use client";

import { Button } from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import { Input } from "@/components/_ui/input";
import {
  DataTable,
  DataTableBar,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableRowHead,
} from "@/components/dashboardblocks/table";
import { cn } from "@/lib/utils";
import {
  describeRequirement,
  featureCoverage,
  limitError,
  parseLimit,
  setLimit,
  setPermissions,
} from "../../../logic/permissions.logic";
import {
  type Entitlements,
  FEATURES,
  type PermissionDef,
  type PermissionKey,
  type PermissionValue,
} from "../../../types/plan-detail.types";

type PermissionTableProps = {
  changed: Set<PermissionKey>;
  entitlements: Entitlements;
  planName: string;
  onChange: (entitlements: Entitlements) => void;
};

export default function PermissionTable({
  changed,
  entitlements,
  planName,
  onChange,
}: PermissionTableProps) {
  const change = (keys: PermissionKey[], on: boolean) =>
    onChange(setPermissions(entitlements, keys, on));

  return (
    <DataTable
      caption={`What ${planName} includes`}
      className="border-t [--data-table-cell-height:auto]"
    >
      <DataTableHeader className="@max-2xl/permissions:hidden">
        <DataTableRow>
          <DataTableHead className="w-80 pe-10">Feature</DataTableHead>
          <DataTableHead className="border-s ps-8">Permissions</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {FEATURES.map((feature) => {
          const coverage = featureCoverage(feature, entitlements);
          const keys = feature.permissions.map(
            (permission) => permission.key as PermissionKey,
          );
          return (
            <DataTableRow
              key={feature.key}
              className="@max-2xl/permissions:flex @max-2xl/permissions:flex-col @max-2xl/permissions:py-2"
            >
              <DataTableRowHead className="w-80 py-6 pe-10 align-top @max-2xl/permissions:w-full @max-2xl/permissions:pe-(--data-table-inset,0.75rem) @max-2xl/permissions:pb-3">
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{feature.label}</span>
                  <span className="text-muted-foreground text-xs text-pretty">
                    {feature.description}
                  </span>
                </span>
                <span className="mt-3 flex items-center gap-3">
                  <DataTableBar
                    className="w-16"
                    max={feature.permissions.length}
                    value={coverage.count}
                  />
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {coverage.count} of {feature.permissions.length}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="ms-auto"
                    aria-label={`${coverage.all ? "Clear" : "Select"} all ${feature.label} permissions`}
                    onClick={() => change(keys, !coverage.all)}
                  >
                    {coverage.all ? "Clear all" : "Select all"}
                  </Button>
                </span>
              </DataTableRowHead>
              <DataTableCell className="border-s py-6 ps-8 align-top @max-2xl/permissions:border-s-0 @max-2xl/permissions:ps-(--data-table-inset,0.75rem) @max-2xl/permissions:pt-0">
                <ul className="grid gap-3 @lg/permissions:grid-cols-2 @3xl/permissions:grid-cols-3">
                  {feature.permissions.map((permission) => {
                    const key = permission.key as PermissionKey;
                    return (
                      <PermissionOption
                        key={key}
                        permission={permission}
                        value={entitlements[key]}
                        changed={changed.has(key)}
                        error={limitError(entitlements, key)}
                        requirement={describeRequirement(key)}
                        onCheckedChange={(on) => change([key], on)}
                        onLimitChange={(limit) =>
                          onChange(setLimit(entitlements, key, limit))
                        }
                      />
                    );
                  })}
                </ul>
              </DataTableCell>
            </DataTableRow>
          );
        })}
      </DataTableBody>
    </DataTable>
  );
}

type PermissionOptionProps = {
  permission: PermissionDef;
  value: PermissionValue;
  changed: boolean;
  error: string | null;
  requirement: string | null;
  onCheckedChange: (on: boolean) => void;
  onLimitChange: (limit: number | null) => void;
};

function PermissionOption({
  permission,
  value,
  changed,
  error,
  requirement,
  onCheckedChange,
  onLimitChange,
}: PermissionOptionProps) {
  const id = `permission-${permission.key}`;
  const limitId = `${id}-limit`;

  return (
    <li
      data-changed={changed || undefined}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border p-3 transition-colors",
        value.enabled && "bg-muted/40",
        changed && "border-primary/40 bg-primary/5",
      )}
    >
      <Checkbox
        id={id}
        className="mt-0.5"
        checked={value.enabled}
        onCheckedChange={(next) => onCheckedChange(next === true)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5">
          <span className="text-sm leading-snug text-pretty">
            {permission.label}
          </span>
          <span className="text-muted-foreground text-xs text-pretty">
            {permission.description}
          </span>
          {requirement && (
            <span className="text-muted-foreground/80 text-xs">
              {requirement}
            </span>
          )}
        </label>
        {permission.kind === "limit" && value.enabled && (
          <span className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <Input
                id={limitId}
                aria-label={`${permission.label} limit`}
                aria-invalid={error ? true : undefined}
                className="h-8 w-28 text-end tabular-nums"
                inputMode="numeric"
                min={0}
                placeholder="Unlimited"
                type="number"
                value={value.limit ?? ""}
                onChange={(event) =>
                  onLimitChange(parseLimit(event.target.value))
                }
              />
              <label
                htmlFor={limitId}
                className="text-muted-foreground text-xs"
              >
                {permission.unit ?? "items"} per user
              </label>
            </span>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </span>
        )}
      </div>
    </li>
  );
}
