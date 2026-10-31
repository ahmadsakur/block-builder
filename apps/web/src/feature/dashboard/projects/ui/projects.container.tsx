"use client";

import {
  CloudAlertIcon,
  FolderKanbanIcon,
  PlusIcon,
  RotateCwIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import {
  useFeature,
  useLimit,
} from "@/feature/dashboard/_shared/query/entitlements.query";
import { upgradeHref } from "@/lib/auth/routes";
import { queryStatus } from "@/lib/query-status";
import { EXPORT_FILE_NAME } from "../data/projects.data";
import { upgradeFor } from "../logic/projects.logic";
import {
  useCreateProject,
  useDeleteProject,
  useExportProjects,
  useProjectsQuery,
} from "../query/projects.query";
import type { Project, ProjectInput } from "../types/projects.types";
import DeleteProjectDialog from "./components/delete-project-dialog";
import ProjectDialog from "./components/form/project-dialog";
import ProjectsHeader from "./components/header/projects-header";
import ProjectList from "./components/list/project-list";

type DeleteTarget = { open: boolean; project?: Project };

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProjectsContainer() {
  const router = useRouter();
  const projects = useProjectsQuery();
  const usage = useLimit("projects.max");
  const exportAllowed = useFeature("projects.export");
  const create = useCreateProject();
  const remove = useDeleteProject();
  const exporter = useExportProjects();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<DeleteTarget>({ open: false });
  const full = usage?.hasRoom === false;
  const list = projects.data;

  const openCreate = () => {
    create.reset();
    setCreating(true);
  };

  const submit = (input: ProjectInput) =>
    create.mutate(input, {
      onSuccess: (saved) => {
        setCreating(false);
        toast.success(`${saved.name} created`);
      },
    });

  const openDelete = (project: Project) => {
    remove.reset();
    setDeleting({ open: true, project });
  };

  const confirmDelete = () => {
    const project = deleting.project;
    if (!project) return;
    remove.mutate(project.id, {
      onSuccess: () => {
        setDeleting((current) => ({ ...current, open: false }));
        toast.success(`${project.name} deleted`);
      },
    });
  };

  const runExport = () =>
    exporter.mutate(undefined, {
      onError: (error) => {
        const permission = upgradeFor(error);
        toast.error(
          error.message,
          permission && {
            action: {
              label: "See plans",
              onClick: () => router.push(upgradeHref(permission)),
            },
          },
        );
      },
      onSuccess: (blob) => saveFile(blob, EXPORT_FILE_NAME),
    });

  return (
    <div className="flex w-full flex-col gap-6">
      <ProjectsHeader
        usage={usage}
        exportAllowed={exportAllowed}
        exporting={exporter.isPending}
        onExport={runExport}
        onCreate={openCreate}
      />
      {projects.isError && !list ? (
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="Your projects didn't load"
          description="We couldn't reach your projects. Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => projects.refetch()}>
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
      ) : list?.length === 0 ? (
        <EmptyState
          bordered
          icon={<FolderKanbanIcon />}
          title="No projects yet"
          description="Create your first project to get started."
          action={
            !full && (
              <Button onClick={openCreate}>
                <PlusIcon />
                New project
              </Button>
            )
          }
        />
      ) : (
        <ProjectList
          projects={list ?? []}
          status={queryStatus(projects)}
          onDelete={openDelete}
        />
      )}
      <ProjectDialog
        open={creating}
        pending={create.isPending}
        error={create.error?.message}
        upgrade={upgradeFor(create.error)}
        onOpenChange={setCreating}
        onSubmit={submit}
      />
      <DeleteProjectDialog
        open={deleting.open}
        project={deleting.project}
        pending={remove.isPending}
        error={remove.error?.message}
        onOpenChange={(open) =>
          setDeleting((current) => ({ ...current, open }))
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
