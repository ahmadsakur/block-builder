"use client";

import {
  CloudAlertIcon,
  DownloadIcon,
  PlusIcon,
  RotateCwIcon,
  SearchXIcon,
  UsersIcon,
} from "lucide-react";
import ColumnMenu from "@/components/_common/data-table/column-menu";
import FilterMenu from "@/components/_common/data-table/filter-menu";
import TableSearch from "@/components/_common/data-table/table-search";
import {
  type ServerTableState,
  useServerDataTable,
} from "@/components/_common/data-table/use-server-data-table";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import {
  BlockBusy,
  BlockStateProvider,
  type BlockStatus,
} from "@/components/dashboardblocks/block-state";
import {
  DataTableContent,
  DataTablePagination,
  DataTableReset,
  DataTableSelectionBar,
} from "@/components/dashboardblocks/data-table";
import type { ListResult } from "@/lib/list-query";
import { toCsv } from "../../../logic/customers.logic";
import type { Customer } from "../../../types/customers.types";
import {
  CUSTOMER_COLUMNS,
  planOptions,
  statusOptions,
} from "./customer-columns";
import { CustomerActionsProvider } from "./row-actions";

const NO_ROWS: Customer[] = [];

function downloadCsv(customers: Customer[]) {
  const url = URL.createObjectURL(
    new Blob([toCsv(customers)], { type: "text/csv" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

type CustomersTableProps = {
  result?: ListResult<Customer>;
  status?: BlockStatus;
  busy: boolean;
  state: ServerTableState;
  onStateChange: (patch: Partial<ServerTableState>) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onCreate: () => void;
  onRetry: () => void;
};

export default function CustomersTable({
  result,
  status,
  busy,
  state,
  onStateChange,
  onEdit,
  onDelete,
  onCreate,
  onRetry,
}: CustomersTableProps) {
  "use no memo";
  const table = useServerDataTable({
    columns: CUSTOMER_COLUMNS,
    getRowId: (row) => row.id,
    initialState: { columnVisibility: { seats: false } },
    onStateChange,
    rows: result?.rows ?? NO_ROWS,
    state,
    total: result?.total ?? 0,
  });
  const selected = table.getSelectedRowModel().rows.map((row) => row.original);
  const unavailable = status !== undefined;

  const filtered =
    state.search.length > 0 ||
    Object.values(state.filters).some((value) => value.length > 0);

  const noCustomers = !filtered && result?.total === 0;

  const clearFilters = () =>
    onStateChange({
      filters: Object.fromEntries(
        Object.keys(state.filters).map((id) => [id, []]),
      ),
      page: 1,
      search: "",
    });

  const setFilter = (id: string, value: string[]) =>
    onStateChange({ filters: { ...state.filters, [id]: value }, page: 1 });

  return (
    <BlockStateProvider state={status}>
      <section className="@container/data-table flex flex-col gap-3">
        <div className="flex min-h-9 flex-wrap items-center gap-2">
          {selected.length > 0 ? (
            <DataTableSelectionBar className="w-full" table={table}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv(selected)}
              >
                <DownloadIcon />
                Export
              </Button>
            </DataTableSelectionBar>
          ) : (
            <>
              <ColumnMenu table={table} disabled={unavailable} />
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <FilterMenu
                  label="Status"
                  options={statusOptions(result?.facets?.status)}
                  value={state.filters.status ?? []}
                  onChange={(value) => setFilter("status", value)}
                  disabled={unavailable}
                />
                <FilterMenu
                  label="Plan"
                  options={planOptions(result?.facets?.plan)}
                  value={state.filters.plan ?? []}
                  onChange={(value) => setFilter("plan", value)}
                  disabled={unavailable}
                />
                <DataTableReset table={table} />
                <TableSearch
                  label="Search customers"
                  placeholder="Search customers…"
                  value={state.search}
                  onChange={(search) => onStateChange({ page: 1, search })}
                  disabled={unavailable}
                />
              </div>
            </>
          )}
        </div>
        <CustomerActionsProvider value={{ onDelete, onEdit }}>
          {status === "error" ? (
            <EmptyState
              bordered
              tone="error"
              icon={<CloudAlertIcon />}
              title="Customers didn't load"
              description="Something went wrong on our side. Your data is safe; try again in a moment."
              action={
                <Button variant="outline" onClick={onRetry}>
                  <RotateCwIcon />
                  Try again
                </Button>
              }
            />
          ) : (
            <BlockBusy busy={busy} label="Updating customers">
              <DataTableContent
                caption="Customers"
                loadingRows={state.pageSize}
                table={table}
                empty={
                  !noCustomers ? (
                    <EmptyState
                      className="text-foreground"
                      icon={<SearchXIcon />}
                      title="No customers match"
                      description="Try a different search, or clear the filters to see every account."
                      action={
                        <Button variant="outline" onClick={clearFilters}>
                          Clear filters
                        </Button>
                      }
                    />
                  ) : (
                    <EmptyState
                      className="text-foreground"
                      icon={<UsersIcon />}
                      title="No customers yet"
                      description="Add your first account to start tracking plans, seats and revenue."
                      action={
                        <Button onClick={onCreate}>
                          <PlusIcon />
                          New customer
                        </Button>
                      }
                    />
                  )
                }
              />
            </BlockBusy>
          )}
        </CustomerActionsProvider>
        {status !== "error" && (
          <DataTablePagination
            className="border-t pt-3"
            pageSizeOptions={[10, 20, 50]}
            table={table}
          />
        )}
      </section>
    </BlockStateProvider>
  );
}
