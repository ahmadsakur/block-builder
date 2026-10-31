"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ServerTableState } from "@/components/_common/data-table/use-server-data-table";
import { planName } from "@/feature/back-office/_shared/logic/plans.logic";
import { usePlansQuery } from "@/feature/back-office/_shared/query/plans.query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { queryStatus } from "@/lib/query-status";
import {
  useSetUserPlan,
  useUserListParams,
  useUsersQuery,
} from "../query/users.query";
import type { ManagedUser, PlanId, UserPlanInput } from "../types/users.types";
import UserPlanDialog from "./components/form/user-plan-dialog";
import UsersTable from "./components/table/users-table";

const SEARCH_DEBOUNCE_MS = 300;

type Target = { open: boolean; user?: ManagedUser };

export default function UsersContainer() {
  const [params, setParams] = useUserListParams();
  const search = useDebouncedValue(params.search, SEARCH_DEBOUNCE_MS);
  const users = useUsersQuery({ ...params, search });
  const plans = usePlansQuery();
  const setPlan = useSetUserPlan();
  const [editing, setEditing] = useState<Target>({ open: false });
  const total = users.data?.total;
  const nameOf = useCallback(
    (id: PlanId) => planName(plans.data, id),
    [plans.data],
  );

  const state: ServerTableState = {
    filters: { plan: params.plan },
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
  };

  const onStateChange = ({ filters, ...patch }: Partial<ServerTableState>) =>
    setParams({
      ...patch,
      ...(filters && { plan: filters.plan as PlanId[] }),
    });

  const openPlan = (user: ManagedUser) => {
    setPlan.reset();
    setEditing({ open: true, user });
  };

  const submit = (input: UserPlanInput) => {
    const user = editing.user;
    if (!user) return;
    setPlan.mutate(
      { id: user.id, input },
      {
        onSuccess: (saved) => {
          setEditing((current) => ({ ...current, open: false }));
          toast.success(`${saved.name} is now on ${nameOf(saved.plan)}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          {total === undefined
            ? "Everyone who signed up, with their plan."
            : `${total} ${total === 1 ? "user" : "users"} match.`}
        </p>
      </header>
      <UsersTable
        result={users.data}
        status={queryStatus(users)}
        busy={users.isPlaceholderData}
        state={state}
        planName={nameOf}
        onStateChange={onStateChange}
        onChangePlan={openPlan}
        onRetry={() => users.refetch()}
      />
      <UserPlanDialog
        open={editing.open}
        user={editing.user}
        planName={nameOf}
        pending={setPlan.isPending}
        error={setPlan.error?.message}
        onOpenChange={(open) => setEditing((current) => ({ ...current, open }))}
        onSubmit={submit}
      />
    </div>
  );
}
