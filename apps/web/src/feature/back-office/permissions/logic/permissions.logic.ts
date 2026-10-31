import {
  FEATURES,
  type PermissionCell,
  type PermissionKey,
  type PermissionMatrix,
  type PlanId,
} from "../types/permissions.types";

export function toCells(matrix: PermissionMatrix): PermissionCell[] {
  return FEATURES.flatMap((feature) =>
    feature.permissions.flatMap((permission) =>
      matrix.plans.map((plan) => {
        const value = matrix.values.find(
          (row) => row.planId === plan.id && row.key === permission.key,
        );
        return {
          enabled: value?.enabled ?? false,
          key: permission.key,
          limit: value ? value.limit : 0,
          planId: plan.id,
        };
      }),
    ),
  );
}

export function cellIndex(
  cells: readonly PermissionCell[],
  planId: PlanId,
  key: PermissionKey,
): number {
  return cells.findIndex((cell) => cell.planId === planId && cell.key === key);
}

function sameCell(a: PermissionCell, b: PermissionCell): boolean {
  return a.enabled === b.enabled && a.limit === b.limit;
}

export function changedCells(
  saved: readonly PermissionCell[],
  draft: readonly PermissionCell[],
): PermissionCell[] {
  return draft.filter((cell) => {
    const before = saved[cellIndex(saved, cell.planId, cell.key)];
    return !before || !sameCell(before, cell);
  });
}

export function parseLimit(input: string): number | null {
  return input.trim() === "" ? null : Number(input);
}
