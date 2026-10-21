"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ServerTableState } from "@/components/_common/data-table/use-server-data-table";
import { Button } from "@/components/_ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { queryStatus } from "@/lib/query-status";
import {
  useCustomerListParams,
  useCustomersQuery,
  useDeleteCustomer,
  useSaveCustomer,
} from "../query/customers.query";
import type {
  Customer,
  CustomerInput,
  CustomerPlan,
  CustomerStatus,
} from "../types/customers.types";
import DeleteCustomerDialog from "./components/delete-customer-dialog";
import CustomerSheet from "./components/form/customer-sheet";
import CustomersTable from "./components/table/customers-table";

const SEARCH_DEBOUNCE_MS = 300;

type Target = { open: boolean; customer?: Customer };

export default function CustomersContainer() {
  const [params, setParams] = useCustomerListParams();
  const search = useDebouncedValue(params.search, SEARCH_DEBOUNCE_MS);
  const customers = useCustomersQuery({ ...params, search });
  const save = useSaveCustomer();
  const remove = useDeleteCustomer();
  const [editing, setEditing] = useState<Target>({ open: false });
  const [deleting, setDeleting] = useState<Target>({ open: false });
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

  const openEditor = (customer?: Customer) => {
    save.reset();
    setEditing({ customer, open: true });
  };

  const openDelete = (customer: Customer) => {
    remove.reset();
    setDeleting({ customer, open: true });
  };

  const submit = (input: CustomerInput) =>
    save.mutate(
      { id: editing.customer?.id, input },
      {
        onSuccess: (saved) => {
          setEditing((current) => ({ ...current, open: false }));
          toast.success(
            editing.customer ? "Changes saved" : `${saved.company} added`,
          );
        },
      },
    );

  const confirmDelete = () => {
    const customer = deleting.customer;
    if (!customer) return;
    remove.mutate(customer.id, {
      onSuccess: () => {
        setDeleting((current) => ({ ...current, open: false }));
        toast.success(`${customer.company} deleted`);
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            {total === undefined
              ? "Every account in the workspace."
              : `${total} ${total === 1 ? "account" : "accounts"} match.`}
          </p>
        </div>
        <Button onClick={() => openEditor()}>
          <PlusIcon />
          New customer
        </Button>
      </header>
      <CustomersTable
        result={customers.data}
        status={queryStatus(customers)}
        busy={customers.isPlaceholderData}
        state={state}
        onStateChange={onStateChange}
        onEdit={openEditor}
        onDelete={openDelete}
      />
      <CustomerSheet
        open={editing.open}
        customer={editing.customer}
        pending={save.isPending}
        error={save.error?.message}
        onOpenChange={(open) => setEditing((current) => ({ ...current, open }))}
        onSubmit={submit}
      />
      <DeleteCustomerDialog
        open={deleting.open}
        customer={deleting.customer}
        pending={remove.isPending}
        error={remove.error?.message}
        onOpenChange={(open) =>
          setDeleting((current) => ({ ...current, open }))
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
