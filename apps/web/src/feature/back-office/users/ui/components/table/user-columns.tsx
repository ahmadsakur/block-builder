import type { FilterOption } from "@/components/_common/data-table/filter-menu";
import { createDataTableColumnHelper } from "@/components/dashboardblocks/data-table";
import {
  StatusLabel,
  type StatusTone,
} from "@/components/dashboardblocks/status-label";
import { userStatus } from "../../../logic/users.logic";
import {
  type ManagedUser,
  PLAN_IDS,
  type PlanId,
  USER_STATUS_LABEL,
  type UserStatus,
} from "../../../types/users.types";
import PlanCell from "./plan-cell";
import RowActions from "./row-actions";

const STATUS_TONE: Record<UserStatus, StatusTone> = {
  active: "good",
  banned: "bad",
  unverified: "warning",
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function planOptions(
  planName: (id: PlanId) => string,
  counts: Record<string, number> = {},
): FilterOption[] {
  return PLAN_IDS.map((plan) => ({
    count: counts[plan] ?? 0,
    label: planName(plan),
    value: plan,
  }));
}

const columnHelper = createDataTableColumnHelper<ManagedUser>();

export const USER_COLUMNS = columnHelper.columns([
  columnHelper.accessor("name", {
    cell: ({ row }) => (
      <>
        <span className="block truncate">{row.original.name}</span>
        <span className="text-muted-foreground block truncate text-xs font-normal">
          {row.original.email}
        </span>
      </>
    ),
    enableHiding: false,
    header: "User",
    meta: { primary: true, truncate: true },
  }),
  columnHelper.accessor("plan", {
    cell: ({ getValue }) => <PlanCell plan={getValue()} />,
    header: "Plan",
    meta: { cellClassName: "whitespace-nowrap" },
  }),
  columnHelper.display({
    cell: ({ row }) => {
      const status = userStatus(row.original);
      return (
        <StatusLabel tone={STATUS_TONE[status]} variant="text">
          {USER_STATUS_LABEL[status]}
        </StatusLabel>
      );
    },
    header: "Status",
    id: "status",
    meta: { cellClassName: "whitespace-nowrap", label: "Status" },
  }),
  columnHelper.accessor("createdAt", {
    cell: ({ getValue }) => dateFormat.format(new Date(getValue())),
    header: "Joined",
    meta: { align: "end" },
    sortDescFirst: true,
  }),
  columnHelper.display({
    cell: ({ row }) => <RowActions user={row.original} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    meta: { align: "end", cellClassName: "w-12", label: "Actions" },
  }),
]);
