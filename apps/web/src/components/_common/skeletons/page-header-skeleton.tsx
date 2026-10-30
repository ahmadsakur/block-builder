import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";

type PageHeaderSkeletonProps = {
  actions?: number;
};

export default function PageHeaderSkeleton({
  actions = 0,
}: PageHeaderSkeletonProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      {actions > 0 && (
        <div className="flex gap-2">
          {placeholderKeys(actions, "action").map((key) => (
            <Skeleton key={key} className="h-9 w-28" />
          ))}
        </div>
      )}
    </div>
  );
}
