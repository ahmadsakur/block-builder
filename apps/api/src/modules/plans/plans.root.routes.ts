import {
  isPermissionKey,
  permissionValueSchema,
} from "@block-builder/shared/entitlements";
import { planIdSchema, planUpdateSchema } from "@block-builder/shared/plans";
import { Hono } from "hono";
import { httpError, parse, readJson } from "../../lib/http";
import type { AuthEnv } from "../auth/auth.middleware";
import {
  getPlan,
  listPlanSummaries,
  permissionMatrix,
  setPermission,
  updatePlan,
} from "./plans.service";

const PLAN_NOT_FOUND = "This plan doesn't exist.";

export const rootPlans = new Hono<AuthEnv>()
  .get("/", async (c) => c.json(await listPlanSummaries()))
  .patch("/:id", async (c) => {
    const id = parse(planIdSchema, c.req.param("id"));
    const input = parse(planUpdateSchema, await readJson(c.req.raw));
    const updated = await updatePlan(id, input);
    if (!updated) throw httpError(404, { message: PLAN_NOT_FOUND });
    return c.json(updated);
  });

export const rootPermissions = new Hono<AuthEnv>()
  .get("/", async (c) => c.json(await permissionMatrix()))
  .put("/:planId/:key", async (c) => {
    const planId = parse(planIdSchema, c.req.param("planId"));
    const key = c.req.param("key");
    if (!isPermissionKey(key)) {
      throw httpError(404, { message: "This permission doesn't exist." });
    }
    const value = parse(permissionValueSchema, await readJson(c.req.raw));
    if (!(await getPlan(planId))) {
      throw httpError(404, { message: PLAN_NOT_FOUND });
    }
    return c.json(await setPermission(planId, key, value));
  });
