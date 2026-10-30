"use client";

import {
  type ColumnFiltersState,
  functionalUpdate,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import {
  type UseDataTableOptions,
  useDataTable,
} from "@/components/dashboardblocks/data-table";
import type { ListQuery } from "@/lib/list-query";

export interface ServerTableState extends ListQuery {
  filters: Record<string, string[]>;
}

type UseServerDataTableOptions<TData extends RowData> = Omit<
  UseDataTableOptions<TData>,
  "data" | "state" | "pageSize"
> & {
  rows: TData[];
  total: number;
  state: ServerTableState;
  onStateChange: (patch: Partial<ServerTableState>) => void;
};

export function useServerDataTable<TData extends RowData>({
  rows,
  total,
  state,
  onStateChange,
  ...options
}: UseServerDataTableOptions<TData>) {
  const pagination: PaginationState = {
    pageIndex: state.page - 1,
    pageSize: state.pageSize,
  };
  const columnFilters: ColumnFiltersState = Object.entries(state.filters)
    .filter(([, values]) => values.length > 0)
    .map(([id, value]) => ({ id, value }));

  return useDataTable({
    ...options,
    data: rows,
    rowCount: total,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    state: {
      columnFilters,
      globalFilter: state.search,
      pagination,
      sorting: state.sort,
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = functionalUpdate(updater, pagination);
      onStateChange({ page: next.pageIndex + 1, pageSize: next.pageSize });
    },
    onSortingChange: (updater: Updater<SortingState>) =>
      onStateChange({ page: 1, sort: functionalUpdate(updater, state.sort) }),
    onGlobalFilterChange: (updater: Updater<string>) =>
      onStateChange({
        page: 1,
        search: functionalUpdate(updater, state.search) ?? "",
      }),
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      const next = functionalUpdate(updater, columnFilters);
      const filters = Object.fromEntries(
        Object.keys(state.filters).map((id) => [
          id,
          (next.find((filter) => filter.id === id)?.value as string[]) ?? [],
        ]),
      );
      onStateChange({ filters, page: 1 });
    },
  });
}
