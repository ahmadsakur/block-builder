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
import { formatNumber } from "@/lib/dashboardblocks/format";
import type { PlanSummary } from "../../types/plans.types";

type PlansTableProps = {
  plans: PlanSummary[];
  status?: BlockStatus;
  onEdit: (plan: PlanSummary) => void;
};

export default function PlansTable({ plans, status, onEdit }: PlansTableProps) {
  return (
    <BlockStateProvider state={getBlockState(status, plans)}>
      <section className="@container/data-table">
        <DataTable caption="Plans">
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead>Plan</DataTableHead>
              <DataTableHead align="end">Users</DataTableHead>
              <DataTableHead align="end">
                <span className="sr-only">Actions</span>
              </DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            <DataTableStateRows colSpan={3} rows={2} />
            {!status &&
              plans.map((plan) => (
                <DataTableRow key={plan.id}>
                  <DataTableCell primary>
                    <span className="block">{plan.name}</span>
                    <span className="text-muted-foreground block text-xs font-normal">
                      {plan.description || "No description"}
                    </span>
                  </DataTableCell>
                  <DataTableCell align="end">
                    <Link
                      href={`/back-office/users?plan=${plan.id}`}
                      className="tabular-nums underline-offset-4 hover:underline"
                    >
                      {formatNumber(plan.userCount)}{" "}
                      {plan.userCount === 1 ? "user" : "users"}
                    </Link>
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
