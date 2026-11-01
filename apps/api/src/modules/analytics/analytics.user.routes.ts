import { Hono } from "hono";
import {
  type EntitlementsEnv,
  withEntitlements,
} from "../plans/plans.middleware";
import { demoAnalytics } from "./analytics.logic";

export const userAnalytics = new Hono<EntitlementsEnv>().get(
  "/",
  withEntitlements("analytics.view"),
  (c) => c.json(demoAnalytics(c.get("user").id, new Date())),
);
