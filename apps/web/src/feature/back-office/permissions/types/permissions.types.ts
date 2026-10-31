import {
  isPermissionKey,
  type PermissionKey,
  permissionValueSchema,
} from "@block-builder/shared/entitlements";
import { planIdSchema } from "@block-builder/shared/plans";
import { z } from "zod";

export {
  FEATURES,
  type PermissionKey,
  type PermissionValue,
} from "@block-builder/shared/entitlements";
export type {
  PermissionMatrix,
  Plan,
  PlanId,
  PlanPermission,
} from "@block-builder/shared/plans";

export const permissionCellSchema = permissionValueSchema.extend({
  key: z.custom<PermissionKey>(
    (value) => typeof value === "string" && isPermissionKey(value),
  ),
  planId: planIdSchema,
});
export type PermissionCell = z.infer<typeof permissionCellSchema>;

export const permissionMatrixFormSchema = z.object({
  cells: z.array(permissionCellSchema),
});
export type PermissionMatrixInput = z.infer<typeof permissionMatrixFormSchema>;
