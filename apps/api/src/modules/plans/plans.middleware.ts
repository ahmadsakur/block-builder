import type {
  Entitlements,
  PermissionKey,
} from "@block-builder/shared/entitlements";
import { toPlanId } from "@block-builder/shared/plans";
import { createMiddleware } from "hono/factory";
import type { AuthEnv } from "../auth/auth.middleware";
import { assertAllowed } from "./plans.logic";
import { entitlementsFor } from "./plans.service";

export type EntitlementsEnv = AuthEnv & {
  Variables: { entitlements: Entitlements };
};

export function withEntitlements(...required: PermissionKey[]) {
  return createMiddleware<EntitlementsEnv>(async (c, next) => {
    const entitlements = await entitlementsFor(toPlanId(c.get("user").plan));
    for (const key of required) assertAllowed(entitlements, key);
    c.set("entitlements", entitlements);
    await next();
  });
}
