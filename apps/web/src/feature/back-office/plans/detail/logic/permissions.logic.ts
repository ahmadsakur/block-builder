import {
  dependentsOf,
  PERMISSION_KEYS,
  permissionDef,
  permissionValueSchema,
  requirementOf,
} from "@block-builder/shared/entitlements";
import type {
  Entitlements,
  FeatureDef,
  PermissionKey,
} from "../types/plan-detail.types";

function grant(entitlements: Entitlements, key: PermissionKey) {
  for (
    let next: PermissionKey | undefined = key;
    next && !entitlements[next].enabled;
    next = requirementOf(next)
  ) {
    const { kind } = permissionDef(next);
    const { limit } = entitlements[next];
    entitlements[next] = {
      enabled: true,
      limit: kind === "limit" && limit === 0 ? null : limit,
    };
  }
}

function revoke(entitlements: Entitlements, key: PermissionKey) {
  entitlements[key] = { ...entitlements[key], enabled: false };
  for (const dependent of dependentsOf(key)) {
    if (entitlements[dependent].enabled) revoke(entitlements, dependent);
  }
}

export function setPermissions(
  entitlements: Entitlements,
  keys: readonly PermissionKey[],
  on: boolean,
): Entitlements {
  const next = { ...entitlements };
  for (const key of keys) {
    if (on) grant(next, key);
    else revoke(next, key);
  }
  return next;
}

export function setLimit(
  entitlements: Entitlements,
  key: PermissionKey,
  limit: number | null,
): Entitlements {
  return { ...entitlements, [key]: { ...entitlements[key], limit } };
}

export function parseLimit(input: string): number | null {
  return input.trim() === "" ? null : Number(input);
}

export function changedPermissions(
  current: Entitlements,
  saved: Entitlements,
): Set<PermissionKey> {
  return new Set(
    PERMISSION_KEYS.filter(
      (key) =>
        current[key].enabled !== saved[key].enabled ||
        (current[key].enabled && current[key].limit !== saved[key].limit),
    ),
  );
}

export function featureCoverage(
  feature: FeatureDef,
  entitlements: Entitlements,
) {
  const count = feature.permissions.filter(
    (permission) => entitlements[permission.key as PermissionKey].enabled,
  ).length;
  return { all: count === feature.permissions.length, count };
}

export function describeRequirement(key: PermissionKey): string | null {
  const required = requirementOf(key);
  return required ? `Needs “${permissionDef(required).label}”` : null;
}

export function limitError(
  entitlements: Entitlements,
  key: PermissionKey,
): string | null {
  const result = permissionValueSchema.safeParse(entitlements[key]);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}

export function firstLimitError(entitlements: Entitlements): string | null {
  for (const key of PERMISSION_KEYS) {
    const error = limitError(entitlements, key);
    if (error) return `${permissionDef(key).label}: ${error}`;
  }
  return null;
}
