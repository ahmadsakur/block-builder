"use client";

import type { ServerTableState } from "@/components/_common/data-table/use-server-data-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { queryStatus } from "@/lib/query-status";
import {
  useCustomerListParams,
  useCustomersQuery,
} from "../query/customers.query";
import type { CustomerPlan, CustomerStatus } from "../types/customers.types";
import CustomersTable from "./components/table/customers-table";

const SEARCH_DEBOUNCE_MS = 300;

export default function CustomersContainer() {
  const [params, setParams] = useCustomerListParams();
  const search = useDebouncedValue(params.search, SEARCH_DEBOUNCE_MS);
  const customers = useCustomersQuery({ ...params, search });
  const total = customers.data?.total;

  const state: ServerTableState = {
    filters: { plan: params.plan, status: params.status },
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
  };

  const onStateChange = ({ filters, ...patch }: Partial<ServerTableState>) =>
    setParams({
      ...patch,
      ...(filters && {
        plan: filters.plan as CustomerPlan[],
        status: filters.status as CustomerStatus[],
      }),
    });

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          {total === undefined
            ? "Every account in the workspace."
            : `${total} ${total === 1 ? "account" : "accounts"} match.`}
        </p>
      </header>
      <CustomersTable
        result={customers.data}
        status={queryStatus(customers)}
        busy={customers.isPlaceholderData}
        state={state}
        onStateChange={onStateChange}
      />
    </div>
  );
}
