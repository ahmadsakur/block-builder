import type { ListQuery } from "@/lib/list-query";

export const CUSTOMER_STATUSES = [
  "active",
  "trial",
  "past-due",
  "churned",
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_PLANS = ["Free", "Pro", "Team", "Enterprise"] as const;
export type CustomerPlan = (typeof CUSTOMER_PLANS)[number];

export interface Customer {
  id: string;
  company: string;
  email: string;
  mrr: number;
  plan: CustomerPlan;
  seats: number;
  signedUp: string;
  status: CustomerStatus;
}

export interface CustomerListQuery extends ListQuery {
  status: CustomerStatus[];
  plan: CustomerPlan[];
}
