import {
  type Entitlements,
  PERMISSION_KEYS,
  resolveEntitlements,
  withRequirements,
} from "@block-builder/shared/entitlements";
import {
  DEFAULT_PLAN,
  type Plan,
  type PlanDetail,
  type PlanId,
  type PlanInput,
  type PlanPerson,
  type PlanRow,
  type PlanWithEntitlements,
} from "@block-builder/shared/plans";
import { and, asc, count, eq, lte, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { user } from "../auth/auth.schema";
import { DEFAULT_PERMISSIONS, DEFAULT_PLANS } from "./plans.data";
import { nextPlanId } from "./plans.logic";
import { plan, planPermission } from "./plans.table";

const FACES_PER_PLAN = 4;

type PlanRecord = typeof plan.$inferSelect;

function toPlan(row: PlanRecord): Plan {
  return {
    description: row.description,
    id: row.id,
    isDefault: row.id === DEFAULT_PLAN,
    name: row.name,
    sort: row.sort,
  };
}

export async function listPlans(): Promise<Plan[]> {
  const rows = await db.select().from(plan).orderBy(asc(plan.sort));
  return rows.map(toPlan);
}

export async function getPlan(id: PlanId): Promise<Plan | null> {
  const row = await db.query.plan.findFirst({ where: eq(plan.id, id) });
  return row ? toPlan(row) : null;
}

async function memberCounts(id?: PlanId): Promise<Map<PlanId, number>> {
  const rows = await db
    .select({ plan: user.plan, members: count() })
    .from(user)
    .where(and(eq(user.role, "user"), id ? eq(user.plan, id) : undefined))
    .groupBy(user.plan);
  return new Map(rows.map((row) => [row.plan, row.members]));
}

async function facesByPlan(): Promise<Map<PlanId, PlanPerson[]>> {
  const ranked = db
    .select({
      id: user.id,
      image: user.image,
      name: user.name,
      plan: user.plan,
      rank: sql<number>`row_number() over (partition by ${user.plan} order by ${user.createdAt} desc)`.as(
        "rank",
      ),
    })
    .from(user)
    .where(eq(user.role, "user"))
    .as("ranked");
  const rows = await db
    .select()
    .from(ranked)
    .where(lte(ranked.rank, FACES_PER_PLAN))
    .orderBy(asc(ranked.rank));
  const faces = new Map<PlanId, PlanPerson[]>();
  for (const row of rows) {
    const person: PlanPerson = {
      id: row.id,
      name: row.name,
      ...(row.image ? { avatarUrl: row.image } : {}),
    };
    faces.set(row.plan, [...(faces.get(row.plan) ?? []), person]);
  }
  return faces;
}

async function permissionRows(id?: PlanId) {
  const query = db.select().from(planPermission);
  return id ? query.where(eq(planPermission.planId, id)) : query;
}

export async function entitlementsFor(id: PlanId): Promise<Entitlements> {
  return resolveEntitlements(await permissionRows(id));
}

export async function listPlansWithEntitlements(): Promise<
  PlanWithEntitlements[]
> {
  const [plans, rows] = await Promise.all([listPlans(), permissionRows()]);
  return plans.map((item) => ({
    ...item,
    entitlements: resolveEntitlements(
      rows.filter((row) => row.planId === item.id),
    ),
  }));
}

export async function listPlanRows(): Promise<PlanRow[]> {
  const [plans, counts, faces] = await Promise.all([
    listPlansWithEntitlements(),
    memberCounts(),
    facesByPlan(),
  ]);
  return plans.map((item) => ({
    ...item,
    faces: faces.get(item.id) ?? [],
    members: counts.get(item.id) ?? 0,
  }));
}

export async function getPlanDetail(id: PlanId): Promise<PlanDetail | null> {
  const [found, counts, entitlements] = await Promise.all([
    getPlan(id),
    memberCounts(id),
    entitlementsFor(id),
  ]);
  return found
    ? { ...found, entitlements, members: counts.get(id) ?? 0 }
    : null;
}

export async function createPlan(input: PlanInput): Promise<Plan> {
  const rows = await db.select({ id: plan.id, sort: plan.sort }).from(plan);
  const id = nextPlanId(input.name, new Set(rows.map((row) => row.id)));
  const sort = Math.max(-1, ...rows.map((row) => row.sort)) + 1;
  const [row] = await db
    .insert(plan)
    .values({ ...input, id, sort })
    .returning();
  if (!row) throw new Error("Plan insert returned no row");
  return toPlan(row);
}

export async function updatePlan(
  id: PlanId,
  input: PlanInput,
): Promise<Plan | null> {
  const [row] = await db
    .update(plan)
    .set(input)
    .where(eq(plan.id, id))
    .returning();
  return row ? toPlan(row) : null;
}

export async function deletePlan(id: PlanId): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({ plan: DEFAULT_PLAN, updatedAt: new Date() })
      .where(eq(user.plan, id));
    const deleted = await tx
      .delete(plan)
      .where(eq(plan.id, id))
      .returning({ id: plan.id });
    return deleted.length > 0;
  });
}

export async function setPlanPermissions(
  id: PlanId,
  entitlements: Entitlements,
): Promise<void> {
  const next = withRequirements(entitlements);
  await db
    .insert(planPermission)
    .values(PERMISSION_KEYS.map((key) => ({ ...next[key], key, planId: id })))
    .onConflictDoUpdate({
      set: {
        enabled: sql`excluded.enabled`,
        limit: sql`excluded.limit`,
      },
      target: [planPermission.planId, planPermission.key],
    });
}

export async function seedPlans(): Promise<void> {
  await db.insert(plan).values(DEFAULT_PLANS).onConflictDoNothing();
  await db
    .insert(planPermission)
    .values(
      DEFAULT_PLANS.flatMap((item) =>
        Object.entries(DEFAULT_PERMISSIONS[item.id] ?? {}).map(
          ([key, value]) => ({ ...value, key, planId: item.id }),
        ),
      ),
    )
    .onConflictDoNothing();
}
