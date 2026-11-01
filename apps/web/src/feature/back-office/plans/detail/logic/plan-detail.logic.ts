import {
  dependentsOf,
  PERMISSION_KEYS,
  permissionDef,
  requirementOf,
  resolveEntitlements,
  withRequirements,
} from "@block-builder/shared/entitlements";
import type {
  Entitlements,
  PermissionKey,
  PermissionRow,
} from "../types/plan-detail.types";

export function toRows(entitlements: Entitlements): PermissionRow[] {
  return PERMISSION_KEYS.map((key) => ({ key, ...entitlements[key] }));
}

export function toEntitlements(rows: readonly PermissionRow[]): Entitlements {
  return resolveEntitlements(rows);
}

export function rowIndex(key: PermissionKey): number {
  return PERMISSION_KEYS.indexOf(key);
}

function switchOff(
  entitlements: Entitlements,
  key: PermissionKey,
): Entitlements {
  return dependentsOf(key).reduce(switchOff, {
    ...entitlements,
    [key]: { ...entitlements[key], enabled: false },
  });
}

export function togglePermission(
  entitlements: Entitlements,
  key: PermissionKey,
  enabled: boolean,
): Entitlements {
  if (!enabled) return switchOff(entitlements, key);
  return withRequirements({
    ...entitlements,
    [key]: { ...entitlements[key], enabled: true },
  });
}

export function changedKeys(
  saved: Entitlements,
  draft: Entitlements,
): PermissionKey[] {
  return PERMISSION_KEYS.filter(
    (key) =>
      saved[key].enabled !== draft[key].enabled ||
      saved[key].limit !== draft[key].limit,
  );
}

export function parseLimit(input: string): number | null {
  return input.trim() === "" ? null : Number(input);
}

export function dependencyHint(key: PermissionKey): string | undefined {
  const required = requirementOf(key);
  if (required) return `Needs ${permissionDef(required).label}.`;
  const dependents = dependentsOf(key);
  if (dependents.length === 0) return undefined;
  const labels = dependents.map((other) => permissionDef(other).label);
  return `Turning it off also turns off ${labels.join(", ")}.`;
}
