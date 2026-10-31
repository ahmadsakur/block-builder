import { API } from "@block-builder/shared/api";
import { api } from "@/lib/api";
import type {
  PermissionCell,
  PermissionMatrix,
  PlanPermission,
} from "../types/permissions.types";

export function getPermissionMatrix(): Promise<PermissionMatrix> {
  return api(API.root.permissions);
}

export function setPermission({
  planId,
  key,
  enabled,
  limit,
}: PermissionCell): Promise<PlanPermission> {
  return api(API.root.permission(planId, key), {
    json: { enabled, limit },
    method: "PUT",
  });
}
