"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  BlockStateProvider,
  type BlockStatus,
} from "@/components/dashboardblocks/block-state";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableStateRows,
} from "@/components/dashboardblocks/table";
import { formatCreatedAt } from "../../../logic/projects.logic";
import type { Project } from "../../../types/projects.types";

const LOADING_ROWS = 3;

type ProjectListProps = {
  projects: Project[];
  status?: BlockStatus;
  onDelete: (project: Project) => void;
};

export default function ProjectList({
  projects,
  status,
  onDelete,
}: ProjectListProps) {
  return (
    <BlockStateProvider state={status}>
      <section className="@container/data-table">
        <DataTable caption="Your projects">
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead>Name</DataTableHead>
              <DataTableHead>Created</DataTableHead>
              <DataTableHead align="end">
                <span className="sr-only">Actions</span>
              </DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            <DataTableStateRows colSpan={3} rows={LOADING_ROWS} />
            {!status &&
              projects.map((project) => (
                <DataTableRow key={project.id}>
                  <DataTableCell primary truncate>
                    {project.name}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground whitespace-nowrap">
                    {formatCreatedAt(project.createdAt)}
                  </DataTableCell>
                  <DataTableCell align="end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${project.name}`}
                      onClick={() => onDelete(project)}
                    >
                      <Trash2Icon />
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              ))}
          </DataTableBody>
        </DataTable>
      </section>
    </BlockStateProvider>
  );
}
