import { API } from "@block-builder/shared/api";
import { userListSearchParams } from "@block-builder/shared/users";
import { api } from "@/lib/api";
import type { ListResult } from "@/lib/list-query";
import type {
  ManagedUser,
  UserListQuery,
  UserPlanInput,
} from "../types/users.types";

export function listUsers(
  query: UserListQuery,
): Promise<ListResult<ManagedUser>> {
  return api(`${API.root.users}?${userListSearchParams(query)}`);
}

export function setUserPlan(
  id: string,
  input: UserPlanInput,
): Promise<ManagedUser> {
  return api(API.root.userPlan(id), { json: input, method: "PATCH" });
}
