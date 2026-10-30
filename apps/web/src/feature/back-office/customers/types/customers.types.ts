import { z } from "zod";
import type { ListQuery } from "@/lib/list-query";

export const CUSTOMER_STATUSES = [
  "active",
  "trial",
  "past-due",
  "churned",
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  active: "Active",
  churned: "Churned",
  "past-due": "Past due",
  trial: "Trial",
};

export const CUSTOMER_PLANS = ["Free", "Pro", "Team", "Enterprise"] as const;
export type CustomerPlan = (typeof CUSTOMER_PLANS)[number];

export const SEAT_PRICE: Record<CustomerPlan, number> = {
  Enterprise: 45,
  Free: 0,
  Pro: 12,
  Team: 24,
};

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

export const customerInputSchema = z.object({
  company: z.string().trim().min(1, "Enter the company name."),
  email: z.email("Enter a valid billing email."),
  plan: z.enum(CUSTOMER_PLANS, "Pick a plan."),
  seats: z
    .number("Enter the number of seats.")
    .int("Use a whole number.")
    .min(1, "At least 1 seat.")
    .max(10_000, "Up to 10,000 seats."),
  status: z.enum(CUSTOMER_STATUSES, "Pick a status."),
});
export type CustomerInput = z.infer<typeof customerInputSchema>;
