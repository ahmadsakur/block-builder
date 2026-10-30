import { type Role, toRole } from "@block-builder/shared/auth";
import { createMiddleware } from "hono/factory";
import { type AuthSession, auth } from "../auth";

export type AuthEnv = {
  Variables: { user: AuthSession["user"]; session: AuthSession["session"] };
};

export function requireAuth(...roles: Role[]) {
  return createMiddleware<AuthEnv>(async (c, next) => {
    const result = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!result) return c.json({ message: "Sign in first." }, 401);
    if (roles.length > 0 && !roles.includes(toRole(result.user.role))) {
      return c.json({ message: "You don't have access to this." }, 403);
    }
    c.set("user", result.user);
    c.set("session", result.session);
    await next();
  });
}
