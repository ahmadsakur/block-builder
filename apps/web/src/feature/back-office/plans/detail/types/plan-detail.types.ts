import {
  isPermissionKey,
  type PermissionKey,
  permissionValueSchema,
} from "@block-builder/shared/entitlements";
import { z } from "zod";

export {
  type Entitlements,
  FEATURES,
  type PermissionKey,
} from "@block-builder/shared/entitlements";
export type { PlanDetail, PlanId } from "@block-builder/shared/plans";

export const permissionRowSchema = permissionValueSchema.extend({
  key: z.custom<PermissionKey>(
    (value) => typeof value === "string" && isPermissionKey(value),
  ),
});
export type PermissionRow = z.infer<typeof permissionRowSchema>;

export const planPermissionsFormSchema = z.object({
  permissions: z.array(permissionRowSchema),
});
export type PlanPermissionsFormInput = z.infer<
  typeof planPermissionsFormSchema
>;
