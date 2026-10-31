import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PlansSkeleton from "./plans-skeleton";

export default function UpgradeSkeleton() {
  return (
    <div className="@container flex w-full max-w-5xl flex-col gap-6">
      <PageHeaderSkeleton />
      <PlansSkeleton />
    </div>
  );
}
