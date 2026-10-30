import type { FilterOption } from "@/components/_common/data-table/filter-menu";
import {
  createDataTableColumnHelper,
  createDataTableSelectColumn,
} from "@/components/dashboardblocks/data-table";
import { Details } from "@/components/dashboardblocks/details";
import {
  StatusLabel,
  type StatusTone,
} from "@/components/dashboardblocks/status-label";
import { formatCurrency } from "@/lib/dashboardblocks/format";
import {
  CUSTOMER_PLANS,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerStatus,
} from "../../../types/customers.types";
import RowActions from "./row-actions";

const STATUS_TONE: Record<CustomerStatus, StatusTone> = {
  active: "good",
  churned: "neutral",
  "past-due": "bad",
  trial: "info",
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function statusOptions(
  counts: Record<string, number> = {},
): FilterOption[] {
  return CUSTOMER_STATUSES.map((status) => ({
    count: counts[status] ?? 0,
    label: CUSTOMER_STATUS_LABEL[status],
    value: status,
  }));
}

export function planOptions(
  counts: Record<string, number> = {},
): FilterOption[] {
  return CUSTOMER_PLANS.map((plan) => ({
    count: counts[plan] ?? 0,
    label: plan,
    value: plan,
  }));
}

const columnHelper = createDataTableColumnHelper<Customer>();

export const CUSTOMER_COLUMNS = columnHelper.columns([
  createDataTableSelectColumn<Customer>({
    getRowLabel: (row) => row.company,
  }),
  columnHelper.accessor("company", {
    cell: ({ row }) => (
      <>
        <span className="block truncate">{row.original.company}</span>
        <span className="text-muted-foreground block truncate text-xs font-normal">
          {row.original.email}
        </span>
      </>
    ),
    enableHiding: false,
    header: "Customer",
    meta: { primary: true, truncate: true },
  }),
  columnHelper.accessor("status", {
    cell: ({ getValue }) => (
      <StatusLabel tone={STATUS_TONE[getValue()]}>
        {CUSTOMER_STATUS_LABEL[getValue()]}
      </StatusLabel>
    ),
    enableSorting: false,
    header: "Status",
    meta: { cellClassName: "whitespace-nowrap" },
  }),
  columnHelper.accessor("plan", {
    cell: ({ row }) => (
      <Details className="text-muted-foreground">
        <span className="text-foreground">{row.original.plan}</span>
        {`${row.original.seats} ${row.original.seats === 1 ? "seat" : "seats"}`}
      </Details>
    ),
    header: "Plan",
    meta: { cellClassName: "whitespace-nowrap" },
  }),
  columnHelper.accessor("seats", {
    header: "Seats",
    meta: { align: "end" },
  }),
  columnHelper.accessor("mrr", {
    cell: ({ getValue }) => formatCurrency(getValue()),
    header: "MRR",
    meta: { align: "end" },
  }),
  columnHelper.accessor("signedUp", {
    cell: ({ getValue }) => dateFormat.format(new Date(getValue())),
    header: "Signed up",
    meta: { align: "end" },
    sortDescFirst: true,
  }),
  columnHelper.display({
    cell: ({ row }) => <RowActions customer={row.original} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    meta: { align: "end", cellClassName: "w-12", label: "Actions" },
  }),
]);
