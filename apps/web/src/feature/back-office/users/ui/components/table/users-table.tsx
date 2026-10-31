"use client";

import {
  CloudAlertIcon,
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
} from "@/components/dashboardblocks/data-table";
import type { ListResult } from "@/lib/list-query";
import type { ManagedUser, PlanId } from "../../../types/users.types";
import { planOptions, USER_COLUMNS } from "./user-columns";
import { UserTableProvider } from "./user-table-context";

const NO_ROWS: ManagedUser[] = [];

type UsersTableProps = {
  result?: ListResult<ManagedUser>;
  status?: BlockStatus;
  busy: boolean;
  state: ServerTableState;
  planName: (id: PlanId) => string;
  onStateChange: (patch: Partial<ServerTableState>) => void;
  onChangePlan: (user: ManagedUser) => void;
  onRetry: () => void;
};

export default function UsersTable({
  result,
  status,
  busy,
  state,
  planName,
  onStateChange,
  onChangePlan,
  onRetry,
}: UsersTableProps) {
  "use no memo";
  const table = useServerDataTable({
    columns: USER_COLUMNS,
    getRowId: (row) => row.id,
    onStateChange,
    rows: result?.rows ?? NO_ROWS,
    state,
    total: result?.total ?? 0,
  });
  const unavailable = status !== undefined;

  const filtered =
    state.search.length > 0 ||
    Object.values(state.filters).some((value) => value.length > 0);

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
          <ColumnMenu table={table} disabled={unavailable} />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <FilterMenu
              label="Plan"
              options={planOptions(planName, result?.facets?.plan)}
              value={state.filters.plan ?? []}
              onChange={(value) => setFilter("plan", value)}
              disabled={unavailable}
            />
            <DataTableReset table={table} />
            <TableSearch
              label="Search users"
              placeholder="Search name or email…"
              value={state.search}
              onChange={(search) => onStateChange({ page: 1, search })}
              disabled={unavailable}
            />
          </div>
        </div>
        <UserTableProvider value={{ onChangePlan, planName }}>
          {status === "error" ? (
            <EmptyState
              bordered
              tone="error"
              icon={<CloudAlertIcon />}
              title="Users didn't load"
              description="Something went wrong on our side. Try again in a moment."
              action={
                <Button variant="outline" onClick={onRetry}>
                  <RotateCwIcon />
                  Try again
                </Button>
              }
            />
          ) : (
            <BlockBusy busy={busy} label="Updating users">
              <DataTableContent
                caption="Users"
                loadingRows={state.pageSize}
                table={table}
                empty={
                  filtered ? (
                    <EmptyState
                      className="text-foreground"
                      icon={<SearchXIcon />}
                      title="No users match"
                      description="Try a different search, or clear the filters to see everyone."
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
                      title="No users yet"
                      description="People who sign up show here, with their plan."
                    />
                  )
                }
              />
            </BlockBusy>
          )}
        </UserTableProvider>
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
