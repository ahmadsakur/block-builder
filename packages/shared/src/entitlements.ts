import { z } from "zod";

export const PERMISSION_KINDS = ["flag", "limit"] as const;
export type PermissionKind = (typeof PERMISSION_KINDS)[number];

export interface PermissionDef {
  key: string;
  kind: PermissionKind;
  label: string;
  description: string;
  unit?: string;
}

export interface FeatureDef {
  key: string;
  label: string;
  permissions: readonly PermissionDef[];
}

export const FEATURES = [
  {
    key: "projects",
    label: "Projects",
    permissions: [
      {
        key: "projects.max",
        kind: "limit",
        label: "Projects",
        description: "How many projects a user can keep at once.",
        unit: "projects",
      },
      {
        key: "projects.export",
        kind: "flag",
        label: "Export projects",
        description: "Download the project list as CSV.",
      },
    ],
  },
  {
    key: "analytics",
    label: "Analytics",
    permissions: [
      {
        key: "analytics.view",
        kind: "flag",
        label: "Analytics page",
        description: "Open the analytics page.",
      },
    ],
  },
] as const satisfies readonly FeatureDef[];

type CatalogPermission = (typeof FEATURES)[number]["permissions"][number];
export type PermissionKey = CatalogPermission["key"];
export type LimitKey = Extract<CatalogPermission, { kind: "limit" }>["key"];
export type FlagKey = Extract<CatalogPermission, { kind: "flag" }>["key"];

export const PERMISSIONS: readonly CatalogPermission[] = FEATURES.flatMap(
  (feature): readonly CatalogPermission[] => feature.permissions,
);
export const PERMISSION_KEYS: readonly PermissionKey[] = PERMISSIONS.map(
  (permission) => permission.key,
);

export function isPermissionKey(value: string): value is PermissionKey {
  return PERMISSION_KEYS.some((key) => key === value);
}

export function permissionDef(key: PermissionKey): PermissionDef {
  const def = PERMISSIONS.find((permission) => permission.key === key);
  if (!def) throw new Error(`Unknown permission ${key}`);
  return def;
}

export const PERMISSION_LIMIT_MAX = 1_000_000;

export const permissionValueSchema = z.object({
  enabled: z.boolean(),
  limit: z
    .number("Enter a number.")
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(PERMISSION_LIMIT_MAX, "Use 1,000,000 or less.")
    .nullable(),
});
export type PermissionValue = z.infer<typeof permissionValueSchema>;

export const DENIED: PermissionValue = { enabled: false, limit: 0 };

export type Entitlements = Record<PermissionKey, PermissionValue>;
export type Usage = Record<LimitKey, number>;

export function resolveEntitlements(
  rows: readonly ({ key: string } & PermissionValue)[],
): Entitlements {
  const entitlements = Object.fromEntries(
    PERMISSION_KEYS.map((key) => [key, DENIED]),
  ) as Entitlements;
  for (const { key, enabled, limit } of rows) {
    if (isPermissionKey(key)) entitlements[key] = { enabled, limit };
  }
  return entitlements;
}

export function isAllowed(
  entitlements: Entitlements,
  key: PermissionKey,
): boolean {
  return entitlements[key].enabled;
}

export function limitOf(
  entitlements: Entitlements,
  key: LimitKey,
): number | null {
  const { enabled, limit } = entitlements[key];
  return enabled ? limit : 0;
}

export function hasRoom(
  entitlements: Entitlements,
  key: LimitKey,
  used: number,
): boolean {
  const limit = limitOf(entitlements, key);
  return limit === null || used < limit;
}

export const ACCESS_ERROR_CODES = ["FEATURE_LOCKED", "LIMIT_REACHED"] as const;
export type AccessErrorCode = (typeof ACCESS_ERROR_CODES)[number];
