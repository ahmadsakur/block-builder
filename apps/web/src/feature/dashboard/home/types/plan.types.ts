import type { LimitKey } from "@/feature/dashboard/_shared/types/entitlements.types";

export type PlanLimit = {
  key: LimitKey;
  name: string;
  unit?: string;
  used: number;
  limit: number | null;
};
