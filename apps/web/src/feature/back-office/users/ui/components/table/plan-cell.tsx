"use client";

import {
  StatusLabel,
  type StatusTone,
} from "@/components/dashboardblocks/status-label";
import type { PlanId } from "../../../types/users.types";
import { useUserTable } from "./user-table-context";

const PLAN_TONE: Record<PlanId, StatusTone> = {
  free: "neutral",
  pro: "info",
};

export default function PlanCell({ plan }: { plan: PlanId }) {
  const table = useUserTable();
  return (
    <StatusLabel tone={PLAN_TONE[plan]}>
      {table?.planName(plan) ?? plan}
    </StatusLabel>
  );
}
