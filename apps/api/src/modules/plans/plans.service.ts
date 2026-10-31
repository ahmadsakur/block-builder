import {
  type Entitlements,
  type PermissionKey,
  type PermissionValue,
  resolveEntitlements,
} from "@block-builder/shared/entitlements";
import {
  type PermissionMatrix,
  PLAN_IDS,
  type Plan,
  type PlanId,
  type PlanPermission,
  type PlanSummary,
  type PlanUpdateInput,
  type PlanWithEntitlements,
} from "@block-builder/shared/plans";
import { asc, count, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { user } from "../auth/auth.schema";
import { DEFAULT_PERMISSIONS, DEFAULT_PLANS } from "./plans.data";
import { plan, planPermission } from "./plans.table";

type PlanRow = typeof plan.$inferSelect;

function toPlan(row: PlanRow): Plan | null {
  const id = PLAN_IDS.find((planId) => planId === row.id);
  return id
    ? { description: row.description, id, name: row.name, sort: row.sort }
    : null;
}

export async function listPlans(): Promise<Plan[]> {
  const rows = await db.select().from(plan).orderBy(asc(plan.sort));
  return rows.flatMap((row) => toPlan(row) ?? []);
}

export async function getPlan(id: PlanId): Promise<Plan | null> {
  const row = await db.query.plan.findFirst({ where: eq(plan.id, id) });
  return row ? toPlan(row) : null;
}

export async function listPlanSummaries(): Promise<PlanSummary[]> {
  const [plans, counts] = await Promise.all([
    listPlans(),
    db
      .select({ plan: user.plan, users: count() })
      .from(user)
      .where(eq(user.role, "user"))
      .groupBy(user.plan),
  ]);
  return plans.map((item) => ({
    ...item,
    userCount: counts.find((row) => row.plan === item.id)?.users ?? 0,
  }));
}

export async function updatePlan(
  id: PlanId,
  input: PlanUpdateInput,
): Promise<Plan | null> {
  const [row] = await db
    .update(plan)
    .set(input)
    .where(eq(plan.id, id))
    .returning();
  return row ? toPlan(row) : null;
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

export async function permissionMatrix(): Promise<PermissionMatrix> {
  const plans = await listPlansWithEntitlements();
  return {
    plans: plans.map(({ entitlements: _, ...item }) => item),
    values: plans.flatMap((item) =>
      Object.entries(item.entitlements).map(([key, value]) => ({
        ...value,
        key: key as PermissionKey,
        planId: item.id,
      })),
    ),
  };
}

export async function seedPlans(): Promise<void> {
  await db.insert(plan).values(DEFAULT_PLANS).onConflictDoNothing();
  await db
    .insert(planPermission)
    .values(
      DEFAULT_PLANS.flatMap((item) =>
        Object.entries(DEFAULT_PERMISSIONS[item.id]).map(([key, value]) => ({
          ...value,
          key,
          planId: item.id,
        })),
      ),
    )
    .onConflictDoNothing();
}

export async function setPermission(
  planId: PlanId,
  key: PermissionKey,
  value: PermissionValue,
): Promise<PlanPermission> {
  await db
    .insert(planPermission)
    .values({ ...value, key, planId })
    .onConflictDoUpdate({
      set: value,
      target: [planPermission.planId, planPermission.key],
    });
  return { ...value, key, planId };
}
