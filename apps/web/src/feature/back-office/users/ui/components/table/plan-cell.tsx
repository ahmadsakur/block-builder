"use client";

import { StatusLabel } from "@/components/dashboardblocks/status-label";
import { planName } from "@/feature/back-office/_shared/logic/plans.logic";
import type { PlanId } from "../../../types/users.types";
import { useUserTable } from "./user-table-context";

export default function PlanCell({ plan }: { plan: PlanId }) {
  const plans = useUserTable()?.plans;
  const found = plans?.find((item) => item.id === plan);
  return (
    <StatusLabel tone={!found || found.isDefault ? "neutral" : "info"}>
      {planName(plans, plan)}
    </StatusLabel>
  );
}
