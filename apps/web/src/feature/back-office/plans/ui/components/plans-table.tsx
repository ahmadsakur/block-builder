"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/_ui/button";
import {
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
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
import { Tag } from "@/components/dashboardblocks/tag";
import { memberLabel, permissionSummary } from "../../logic/plans.logic";
import type { PlanRow } from "../../types/plans.types";
import PlanFaces from "./plan-faces";

type PlansTableProps = {
  plans: PlanRow[];
  status?: BlockStatus;
  onEdit: (plan: PlanRow) => void;
};

export default function PlansTable({ plans, status, onEdit }: PlansTableProps) {
  return (
    <BlockStateProvider state={getBlockState(status, plans)}>
      <section className="@container/data-table">
        <DataTable caption="Plans">
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead>Plan</DataTableHead>
              <DataTableHead>Users</DataTableHead>
              <DataTableHead align="end">Permissions</DataTableHead>
              <DataTableHead align="end">
                <span className="sr-only">Actions</span>
              </DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            <DataTableStateRows colSpan={4} rows={2} />
            {!status &&
              plans.map((plan) => (
                <DataTableRow key={plan.id}>
                  <DataTableCell primary>
                    <span className="flex items-center gap-2">
                      <Link
                        href={`/back-office/plans/${plan.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {plan.name}
                      </Link>
                      {plan.isDefault && <Tag>Default</Tag>}
                    </span>
                    <span className="text-muted-foreground block text-xs font-normal">
                      {plan.description || "No description"}
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className="flex items-center gap-2">
                      <PlanFaces faces={plan.faces} />
                      <Link
                        href={`/back-office/users?plan=${plan.id}`}
                        className="tabular-nums whitespace-nowrap underline-offset-4 hover:underline"
                      >
                        {memberLabel(plan.members)}
                      </Link>
                    </span>
                  </DataTableCell>
                  <DataTableCell align="end" className="tabular-nums">
                    {permissionSummary(plan.entitlements)}
                  </DataTableCell>
                  <DataTableCell align="end" className="w-12">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${plan.name}`}
                      onClick={() => onEdit(plan)}
                    >
                      <PencilIcon />
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
