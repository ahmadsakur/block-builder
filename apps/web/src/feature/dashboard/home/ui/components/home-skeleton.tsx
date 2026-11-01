import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";
import { Skeleton } from "@/components/_ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your home"
      className="@container flex w-full flex-col gap-8"
    >
      <PageHeaderSkeleton />
      <div className="grid items-start gap-8 @4xl:grid-cols-3">
        <PanelSkeleton body="rows" rows={1} />
        <Skeleton className="h-64 w-full rounded-xl @4xl:col-span-2" />
      </div>
    </div>
  );
}
