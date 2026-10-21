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
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerStatus,
} from "../../../types/customers.types";

const STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; tone: StatusTone }
> = {
  active: { label: "Active", tone: "good" },
  churned: { label: "Churned", tone: "neutral" },
  "past-due": { label: "Past due", tone: "bad" },
  trial: { label: "Trial", tone: "info" },
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
    label: STATUS_CONFIG[status].label,
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
    cell: ({ getValue }) => {
      const status = STATUS_CONFIG[getValue()];
      return <StatusLabel tone={status.tone}>{status.label}</StatusLabel>;
    },
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
]);
