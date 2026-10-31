"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import type { PermissionKey } from "@/feature/dashboard/_shared/types/entitlements.types";
import type { ProjectInput } from "../../../types/projects.types";
import ProjectForm from "./project-form";

type ProjectDialogProps = {
  open: boolean;
  pending: boolean;
  error?: string;
  upgrade?: PermissionKey;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectInput) => void;
};

export default function ProjectDialog({
  open,
  pending,
  error,
  upgrade,
  onOpenChange,
  onSubmit,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Give it a name you'll recognise. You can delete it at any time.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          pending={pending}
          error={error}
          upgrade={upgrade}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
