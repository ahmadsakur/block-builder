import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import { Skeleton } from "@/components/_ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your home"
      className="flex flex-col gap-4"
    >
      <PageHeaderSkeleton />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
