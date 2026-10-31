import { API } from "@block-builder/shared/api";
import { api, apiBlob } from "@/lib/api";
import type { Project, ProjectInput } from "../types/projects.types";

export function listProjects(): Promise<Project[]> {
  return api<Project[]>(API.user.projects);
}

export function createProject(input: ProjectInput): Promise<Project> {
  return api<Project>(API.user.projects, { json: input, method: "POST" });
}

export function deleteProject(id: string): Promise<void> {
  return api(API.user.project(id), { method: "DELETE" });
}

export function exportProjects(): Promise<Blob> {
  return apiBlob(API.user.projectsExport);
}
