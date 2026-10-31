import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";

export default function ProjectsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading projects"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton actions={2} />
      <div className="flex flex-col">
        <div className="flex items-center gap-6 border-b px-3 py-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        {placeholderKeys(3, "row").map((key) => (
          <div
            key={key}
            className="flex items-center gap-6 border-b px-3 py-3.5"
          >
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto size-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
