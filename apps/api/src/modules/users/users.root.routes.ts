import {
  userListParamsSchema,
  userPlanSchema,
} from "@block-builder/shared/users";
import { Hono } from "hono";
import { httpError, parse, readJson } from "../../lib/http";
import type { AuthEnv } from "../auth/auth.middleware";
import { getPlan } from "../plans/plans.service";
import { listUsers, setUserPlan } from "./users.service";

export const rootUsers = new Hono<AuthEnv>()
  .get("/", async (c) =>
    c.json(await listUsers(parse(userListParamsSchema, c.req.query()))),
  )
  .patch("/:id/plan", async (c) => {
    const { plan } = parse(userPlanSchema, await readJson(c.req.raw));
    if (!(await getPlan(plan))) {
      throw httpError(400, { message: "That plan doesn't exist." });
    }
    const updated = await setUserPlan(c.req.param("id"), plan);
    if (!updated) {
      throw httpError(404, { message: "This user no longer exists." });
    }
    return c.json(updated);
  });
