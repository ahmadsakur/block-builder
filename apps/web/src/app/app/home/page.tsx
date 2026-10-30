import type { Metadata } from "next";
import { Suspense } from "react";
import HomeSkeleton from "@/feature/dashboard/home/ui/components/home-skeleton";
import HomeContainer from "@/feature/dashboard/home/ui/home.container";

export const metadata: Metadata = { title: "Home" };

export default function AppHomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContainer />
    </Suspense>
  );
}
