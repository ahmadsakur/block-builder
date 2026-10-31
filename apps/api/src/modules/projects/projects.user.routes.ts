import { projectInputSchema } from "@block-builder/shared/projects";
import { Hono } from "hono";
import { httpError, parse, readJson } from "../../lib/http";
import {
  type EntitlementsEnv,
  withEntitlements,
} from "../plans/plans.middleware";
import { projectsCsv } from "./projects.logic";
import { createProject, deleteProject, listProjects } from "./projects.service";

export const userProjects = new Hono<EntitlementsEnv>()
  .get("/", async (c) => c.json(await listProjects(c.get("user").id)))
  .get("/export", withEntitlements("projects.export"), async (c) => {
    const csv = projectsCsv(await listProjects(c.get("user").id));
    return c.body(csv, 200, {
      "Content-Disposition": 'attachment; filename="projects.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    });
  })
  .post("/", withEntitlements(), async (c) => {
    const input = parse(projectInputSchema, await readJson(c.req.raw));
    const created = await createProject(
      c.get("user").id,
      c.get("entitlements"),
      input,
    );
    return c.json(created, 201);
  })
  .delete("/:id", async (c) => {
    const deleted = await deleteProject(c.get("user").id, c.req.param("id"));
    if (!deleted) {
      throw httpError(404, { message: "This project no longer exists." });
    }
    return c.body(null, 204);
  });
