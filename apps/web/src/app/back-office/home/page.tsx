import type { Metadata } from "next";
import { Suspense } from "react";
import HomeSkeleton from "@/feature/back-office/home/ui/components/home-skeleton";
import HomeContainer from "@/feature/back-office/home/ui/home.container";

export const metadata: Metadata = { title: "Home" };

export default function BackOfficeHomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContainer />
    </Suspense>
  );
}
