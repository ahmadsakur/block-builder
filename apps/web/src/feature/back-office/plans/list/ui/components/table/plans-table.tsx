"use client";

import type { ReactNode } from "react";
import {
  createDataTableColumnHelper,
  DataTableContent,
  DataTablePagination,
  useDataTable,
} from "@/components/dashboardblocks/data-table";
import {
  DataTableBar,
  DataTableRowLink,
} from "@/components/dashboardblocks/table";
import { Tag } from "@/components/dashboardblocks/tag";
import type { PlanRow } from "../../../../_shared/types/plans.types";
import PlanMark from "../../../../_shared/ui/plan-mark";
import { describeReach, grantedOf } from "../../../logic/plan-list.logic";
import MemberFaces from "./member-faces";
import PlanRowActionsMenu from "./plan-row-actions";

const PAGE_SIZE = 10;

const columnHelper = createDataTableColumnHelper<PlanRow>();

function planColumns(permissionCount: number) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-3">
          <PlanMark plan={row.original} />
          <DataTableRowLink href={`/back-office/plans/${row.original.id}`}>
            {row.original.name}
          </DataTableRowLink>
          {row.original.isDefault && <Tag>Default</Tag>}
        </span>
      ),
      header: "Plan",
      meta: {
        cellClassName: "w-64 max-w-64",
        headerClassName: "w-64",
        primary: true,
      },
    }),
    columnHelper.accessor("description", {
      cell: ({ row }) =>
        row.original.description ? (
          <span
            className="text-muted-foreground"
            title={row.original.description}
          >
            {row.original.description}
          </span>
        ) : (
          <span className="text-muted-foreground/60">No description</span>
        ),
      enableGlobalFilter: false,
      enableSorting: false,
      header: "Description",
      meta: { truncate: true },
    }),
    columnHelper.accessor("members", {
      cell: ({ row }) => <MemberFaces plan={row.original} />,
      enableGlobalFilter: false,
      header: "Users",
      meta: { cellClassName: "w-40", headerClassName: "w-40" },
    }),
    columnHelper.display({
      cell: ({ row }) => {
        const granted = grantedOf(row.original);
        return (
          <span className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between gap-3 text-xs">
              <span className="truncate">{describeReach(row.original)}</span>
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {granted} of {permissionCount}
              </span>
            </span>
            <DataTableBar max={permissionCount} value={granted} />
          </span>
        );
      },
      header: "Includes",
      id: "includes",
      meta: { cellClassName: "w-60", headerClassName: "w-60" },
    }),
    columnHelper.display({
      cell: ({ row }) => <PlanRowActionsMenu plan={row.original} />,
      header: () => <span className="sr-only">Actions</span>,
      id: "actions",
      meta: { align: "end", cellClassName: "w-12", label: "Actions" },
    }),
  ]);
}

type PlansTableProps = {
  empty: ReactNode;
  permissionCount: number;
  plans: PlanRow[];
  search: string;
};

export default function PlansTable({
  empty,
  permissionCount,
  plans,
  search,
}: PlansTableProps) {
  "use no memo";
  const table = useDataTable({
    columns: planColumns(permissionCount),
    data: plans,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    state: { globalFilter: search },
  });

  return (
    <section className="@container/data-table flex flex-col gap-3">
      <DataTableContent
        caption="Plans"
        className="border-t"
        empty={empty}
        table={table}
      />
      {table.getPrePaginatedRowModel().rows.length > PAGE_SIZE && (
        <DataTablePagination className="border-t pt-3" table={table} />
      )}
    </section>
  );
}
