import {
  type AccessErrorCode,
  type Entitlements,
  hasRoom,
  isAllowed,
  type LimitKey,
  limitOf,
  type PermissionKey,
  permissionDef,
} from "@block-builder/shared/entitlements";

export class AccessError extends Error {
  constructor(
    readonly code: AccessErrorCode,
    readonly permission: PermissionKey,
    message: string,
  ) {
    super(message);
  }
}

export function assertAllowed(
  entitlements: Entitlements,
  key: PermissionKey,
): void {
  if (isAllowed(entitlements, key)) return;
  throw new AccessError(
    "FEATURE_LOCKED",
    key,
    `${permissionDef(key).label} isn't included in your plan. Upgrade to unlock it.`,
  );
}

export function assertRoom(
  entitlements: Entitlements,
  key: LimitKey,
  used: number,
): void {
  if (hasRoom(entitlements, key, used)) return;
  const { unit = "items" } = permissionDef(key);
  throw new AccessError(
    "LIMIT_REACHED",
    key,
    `Your plan allows ${limitOf(entitlements, key)} ${unit}. Upgrade for more.`,
  );
}
