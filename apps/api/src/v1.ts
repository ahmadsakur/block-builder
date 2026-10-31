import { Hono } from "hono";
import { userAnalytics } from "./modules/analytics/analytics.user.routes";
import { type AuthEnv, requireAuth } from "./modules/auth/auth.middleware";
import { rootPermissions, rootPlans } from "./modules/plans/plans.root.routes";
import { userEntitlements, userPlans } from "./modules/plans/plans.user.routes";
import { userProjects } from "./modules/projects/projects.user.routes";
import { rootUsers } from "./modules/users/users.root.routes";

const root = new Hono<AuthEnv>()
  .use(requireAuth("root"))
  .route("/users", rootUsers)
  .route("/plans", rootPlans)
  .route("/permissions", rootPermissions);

const user = new Hono<AuthEnv>()
  .use(requireAuth("user"))
  .route("/entitlements", userEntitlements)
  .route("/plans", userPlans)
  .route("/projects", userProjects)
  .route("/analytics", userAnalytics);

export const v1 = new Hono().route("/root", root).route("/user", user);
