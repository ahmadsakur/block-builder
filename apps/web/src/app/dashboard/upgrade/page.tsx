import type { Metadata } from "next";
import { Suspense } from "react";
import UpgradeSkeleton from "@/feature/dashboard/upgrade/ui/components/upgrade-skeleton";
import UpgradeContainer from "@/feature/dashboard/upgrade/ui/upgrade.container";

export const metadata: Metadata = { title: "Upgrade" };

export default function UpgradePage() {
  return (
    <Suspense fallback={<UpgradeSkeleton />}>
      <UpgradeContainer />
    </Suspense>
  );
}
