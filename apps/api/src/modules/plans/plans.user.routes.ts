import type { MyEntitlements } from "@block-builder/shared/plans";
import { toPlanId } from "@block-builder/shared/plans";
import { Hono } from "hono";
import { httpError } from "../../lib/http";
import type { AuthEnv } from "../auth/auth.middleware";
import { countProjects } from "../projects/projects.service";
import { type EntitlementsEnv, withEntitlements } from "./plans.middleware";
import { getPlan, listPlansWithEntitlements } from "./plans.service";

export const userEntitlements = new Hono<EntitlementsEnv>().get(
  "/",
  withEntitlements(),
  async (c) => {
    const user = c.get("user");
    const plan = await getPlan(toPlanId(user.plan));
    if (!plan) throw httpError(500, { message: "Your plan is missing." });
    const body: MyEntitlements = {
      entitlements: c.get("entitlements"),
      plan,
      usage: { "projects.max": await countProjects(user.id) },
    };
    return c.json(body);
  },
);

export const userPlans = new Hono<AuthEnv>().get("/", async (c) =>
  c.json(await listPlansWithEntitlements()),
);
