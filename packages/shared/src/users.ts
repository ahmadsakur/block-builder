import { z } from "zod";
import { type ListQuery, parseSort, serializeSort } from "./list-query";
import { type PlanId, planIdSchema } from "./plans";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  plan: PlanId;
  emailVerified: boolean;
  banned: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export const USER_SORT_FIELDS = ["name", "email", "plan", "createdAt"] as const;
export type UserSortField = (typeof USER_SORT_FIELDS)[number];

export interface UserListQuery extends ListQuery {
  plan: PlanId[];
}

const csv = z
  .string()
  .optional()
  .transform((value) => (value ? value.split(",").filter(Boolean) : []));

export const userListParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z
    .string()
    .optional()
    .transform((value) =>
      parseSort(value ?? "").filter((rule) =>
        USER_SORT_FIELDS.some((field) => field === rule.id),
      ),
    ),
  search: z.string().trim().max(100).default(""),
  plan: csv.pipe(z.array(planIdSchema)),
});

export function userListSearchParams(query: UserListQuery): URLSearchParams {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.sort.length > 0) params.set("sort", serializeSort(query.sort));
  if (query.search) params.set("search", query.search);
  if (query.plan.length > 0) params.set("plan", query.plan.join(","));
  return params;
}

export const userPlanSchema = z.object({ plan: planIdSchema });
export type UserPlanInput = z.infer<typeof userPlanSchema>;
