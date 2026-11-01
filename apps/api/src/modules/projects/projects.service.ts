import type { Entitlements } from "@block-builder/shared/entitlements";
import type { Project, ProjectInput } from "@block-builder/shared/projects";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { assertRoom } from "../plans/plans.logic";
import { project } from "./projects.table";

type ProjectRow = typeof project.$inferSelect;

function toProject(row: ProjectRow): Project {
  return {
    createdAt: row.createdAt.toISOString(),
    id: row.id,
    name: row.name,
  };
}

export async function listProjects(userId: string): Promise<Project[]> {
  const rows = await db
    .select()
    .from(project)
    .where(eq(project.userId, userId))
    .orderBy(desc(project.createdAt));
  return rows.map(toProject);
}

export async function countProjects(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.userId, userId));
  return row?.total ?? 0;
}

export async function createProject(
  userId: string,
  entitlements: Entitlements,
  input: ProjectInput,
): Promise<Project> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}))`);
    const [used] = await tx
      .select({ total: count() })
      .from(project)
      .where(eq(project.userId, userId));
    assertRoom(entitlements, "projects.max", used?.total ?? 0);
    const [row] = await tx
      .insert(project)
      .values({ name: input.name, userId })
      .returning();
    if (!row) throw new Error("Insert returned no project.");
    return toProject(row);
  });
}

export async function deleteProject(
  userId: string,
  id: string,
): Promise<boolean> {
  const rows = await db
    .delete(project)
    .where(and(eq(project.id, id), eq(project.userId, userId)))
    .returning({ id: project.id });
  return rows.length > 0;
}
