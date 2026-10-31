import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { db } from "./db/client";
import { env } from "./env";
import { auth } from "./modules/auth/auth";
import { avatars } from "./modules/avatars/avatars.routes";
import { AccessError } from "./modules/plans/plans.logic";
import { v1 } from "./v1";

export const app = new Hono()
  .basePath("/api")
  .use(
    logger(),
    secureHeaders(),
    csrf({ origin: new URL(env.BETTER_AUTH_URL).origin }),
  )
  .onError((error, c) => {
    if (error instanceof HTTPException) return error.getResponse();
    if (error instanceof AccessError) {
      const { code, message, permission } = error;
      return c.json({ code, message, permission }, 403);
    }
    console.error(error);
    return c.json({ message: "Something went wrong. Try again." }, 500);
  })
  .get("/health", async (c) => {
    await db.execute(sql`select 1`);
    return c.json({ ok: true });
  })
  .all("/auth/*", (c) => auth.handler(c.req.raw))
  .route("/avatars", avatars)
  .route("/v1", v1);
