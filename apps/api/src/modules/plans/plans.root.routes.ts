import {
  planIdSchema,
  planInputSchema,
  planPermissionsSchema,
} from "@block-builder/shared/plans";
import { Hono } from "hono";
import { httpError, parse, readJson } from "../../lib/http";
import type { AuthEnv } from "../auth/auth.middleware";
import {
  createPlan,
  deletePlan,
  getPlan,
  getPlanDetail,
  listPlanRows,
  memberCount,
  setPlanPermissions,
  updatePlan,
} from "./plans.service";

const PLAN_NOT_FOUND = "This plan doesn't exist.";

function notFound() {
  return httpError(404, { message: PLAN_NOT_FOUND });
}

export const rootPlans = new Hono<AuthEnv>()
  .get("/", async (c) => c.json(await listPlanRows()))
  .post("/", async (c) => {
    const input = parse(planInputSchema, await readJson(c.req.raw));
    return c.json(await createPlan(input), 201);
  })
  .get("/:id", async (c) => {
    const detail = await getPlanDetail(parse(planIdSchema, c.req.param("id")));
    if (!detail) throw notFound();
    return c.json(detail);
  })
  .patch("/:id", async (c) => {
    const id = parse(planIdSchema, c.req.param("id"));
    const input = parse(planInputSchema, await readJson(c.req.raw));
    const updated = await updatePlan(id, input);
    if (!updated) throw notFound();
    return c.json(updated);
  })
  .delete("/:id", async (c) => {
    const found = await getPlan(parse(planIdSchema, c.req.param("id")));
    if (!found) throw notFound();
    if (found.isDefault) {
      throw httpError(409, {
        message: "The default plan can't be deleted. New sign-ups join it.",
      });
    }
    if (!(await deletePlan(found.id))) {
      const members = await memberCount(found.id);
      throw httpError(409, {
        message: `${found.name} still has ${members} ${members === 1 ? "user" : "users"}. Move them to another plan first.`,
      });
    }
    return c.body(null, 204);
  })
  .put("/:id/permissions", async (c) => {
    const id = parse(planIdSchema, c.req.param("id"));
    const { entitlements } = parse(
      planPermissionsSchema,
      await readJson(c.req.raw),
    );
    if (!(await getPlan(id))) throw notFound();
    await setPlanPermissions(id, entitlements);
    const detail = await getPlanDetail(id);
    if (!detail) throw notFound();
    return c.json(detail);
  });
