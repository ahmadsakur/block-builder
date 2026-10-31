"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPermissionMatrix,
  setPermission,
} from "../service/permissions.service";
import type { PermissionCell } from "../types/permissions.types";

export const permissionKeys = {
  all: ["back-office", "permissions"] as const,
};

export function usePermissionMatrixQuery() {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: getPermissionMatrix,
  });
}

export function useSavePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (cells: PermissionCell[]) =>
      Promise.all(cells.map((cell) => setPermission(cell))),
    onSettled: () => client.invalidateQueries({ queryKey: permissionKeys.all }),
  });
}
