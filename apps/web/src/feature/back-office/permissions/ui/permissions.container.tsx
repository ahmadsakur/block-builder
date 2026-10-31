"use client";

import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";
import { Button } from "@/components/_ui/button";
import { toCells } from "../logic/permissions.logic";
import {
  usePermissionMatrixQuery,
  useSavePermissions,
} from "../query/permissions.query";
import type { PermissionCell } from "../types/permissions.types";
import PermissionMatrix from "./components/permission-matrix";

export default function PermissionsContainer() {
  const matrix = usePermissionMatrixQuery();
  const save = useSavePermissions();

  const submit = (changed: PermissionCell[]) => {
    if (changed.length === 0) return;
    save.mutate(changed, {
      onSuccess: () =>
        toast.success(
          `${changed.length} ${changed.length === 1 ? "permission" : "permissions"} saved`,
        ),
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Permissions</h1>
        <p className="text-muted-foreground">
          Choose what each plan includes. Leave a limit empty for unlimited. New
          features show up here switched off for every plan.
        </p>
      </header>
      {matrix.isError ? (
        <EmptyState
          bordered
          tone="error"
          icon={<CloudAlertIcon />}
          title="Permissions didn't load"
          description="Something went wrong on our side. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => matrix.refetch()}>
              <RotateCwIcon />
              Try again
            </Button>
          }
        />
      ) : matrix.data ? (
        <PermissionMatrix
          key={matrix.dataUpdatedAt}
          plans={matrix.data.plans}
          cells={toCells(matrix.data)}
          pending={save.isPending}
          error={save.error?.message}
          onSubmit={submit}
        />
      ) : (
        <PanelSkeleton body="rows" rows={6} />
      )}
    </div>
  );
}
