import type { Metadata } from "next";
import { Suspense } from "react";
import CustomersSkeleton from "@/feature/dashboard/customers/ui/components/customers-skeleton";
import CustomersContainer from "@/feature/dashboard/customers/ui/customers.container";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <Suspense fallback={<CustomersSkeleton />}>
      <CustomersContainer />
    </Suspense>
  );
}
