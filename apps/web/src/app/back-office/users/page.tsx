import type { Metadata } from "next";
import { Suspense } from "react";
import UsersSkeleton from "@/feature/back-office/users/ui/components/users-skeleton";
import UsersContainer from "@/feature/back-office/users/ui/users.container";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <UsersContainer />
    </Suspense>
  );
}
