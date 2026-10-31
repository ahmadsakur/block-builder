import type { ListResult } from "@block-builder/shared/list-query";
import { type PlanId, toPlanId } from "@block-builder/shared/plans";
import type {
  ManagedUser,
  UserListQuery,
  UserSortField,
} from "@block-builder/shared/users";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  type SQL,
} from "drizzle-orm";
import { db } from "../../db/client";
import { user } from "../auth/auth.schema";

type UserRow = typeof user.$inferSelect;

const SORT_COLUMNS = {
  createdAt: user.createdAt,
  email: user.email,
  name: user.name,
  plan: user.plan,
} satisfies Record<UserSortField, unknown>;

function toManagedUser(row: UserRow): ManagedUser {
  return {
    banned: row.banned ?? false,
    createdAt: row.createdAt.toISOString(),
    email: row.email,
    emailVerified: row.emailVerified,
    id: row.id,
    name: row.name,
    plan: toPlanId(row.plan),
    ...(row.image ? { avatarUrl: row.image } : {}),
  };
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function listUsers(
  query: UserListQuery,
): Promise<ListResult<ManagedUser>> {
  const scope = eq(user.role, "user");
  const search = query.search
    ? or(
        ilike(user.name, `%${escapeLike(query.search)}%`),
        ilike(user.email, `%${escapeLike(query.search)}%`),
      )
    : undefined;
  const plans =
    query.plan.length > 0 ? inArray(user.plan, query.plan) : undefined;
  const where = and(scope, search, plans);
  const order: SQL[] = query.sort.map((rule) => {
    const column = SORT_COLUMNS[rule.id as UserSortField];
    return rule.desc ? desc(column) : asc(column);
  });

  const [rows, [total], facetRows] = await Promise.all([
    db
      .select()
      .from(user)
      .where(where)
      .orderBy(...order, desc(user.createdAt), asc(user.id))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize),
    db.select({ total: count() }).from(user).where(where),
    db
      .select({ plan: user.plan, total: count() })
      .from(user)
      .where(and(scope, search))
      .groupBy(user.plan),
  ]);

  return {
    facets: {
      plan: Object.fromEntries(facetRows.map((row) => [row.plan, row.total])),
    },
    rows: rows.map(toManagedUser),
    total: total?.total ?? 0,
  };
}

export async function setUserPlan(
  id: string,
  plan: PlanId,
): Promise<ManagedUser | null> {
  const [row] = await db
    .update(user)
    .set({ plan, updatedAt: new Date() })
    .where(and(eq(user.id, id), eq(user.role, "user")))
    .returning();
  return row ? toManagedUser(row) : null;
}
