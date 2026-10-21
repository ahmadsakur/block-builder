import type { Metadata } from "next";
import { Suspense } from "react";
import CustomersContainer from "@/feature/dashboard/customers/ui/customers.container";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersContainer />
    </Suspense>
  );
}
