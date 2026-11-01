"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInvalidateEntitlements } from "@/feature/dashboard/_shared/query/entitlements.query";
import { isAccessError } from "@/lib/api";
import {
  createProject,
  deleteProject,
  exportProjects,
  listProjects,
} from "../service/projects.service";

export const projectKeys = {
  all: ["projects"] as const,
};

export function useProjectsQuery() {
  return useQuery({ queryKey: projectKeys.all, queryFn: listProjects });
}

function useRefreshProjects() {
  const client = useQueryClient();
  const invalidateEntitlements = useInvalidateEntitlements();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: projectKeys.all }),
      invalidateEntitlements(),
    ]);
}

function useRefreshOnAccessError() {
  const invalidateEntitlements = useInvalidateEntitlements();
  return (error: Error) => {
    if (isAccessError(error)) invalidateEntitlements();
  };
}

export function useCreateProject() {
  const refresh = useRefreshProjects();
  const onError = useRefreshOnAccessError();
  return useMutation({
    mutationFn: createProject,
    onError,
    onSuccess: refresh,
  });
}

export function useDeleteProject() {
  const refresh = useRefreshProjects();
  return useMutation({ mutationFn: deleteProject, onSuccess: refresh });
}

export function useExportProjects() {
  const onError = useRefreshOnAccessError();
  return useMutation({ mutationFn: exportProjects, onError });
}
