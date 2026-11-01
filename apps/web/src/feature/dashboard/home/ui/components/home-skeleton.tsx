import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";
import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";

const KPI_COUNT = 4;

export default function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your home"
      className="@container flex w-full flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
      </div>
      <div className="grid gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {placeholderKeys(KPI_COUNT).map((key) => (
          <Skeleton key={key} className="h-64 rounded-2xl" />
        ))}
      </div>
      <div className="grid items-start gap-6 @5xl:grid-cols-3">
        <div className="flex flex-col gap-6 @5xl:col-span-2">
          <PanelSkeleton body="rows" rows={2} />
          <PanelSkeleton body="rows" rows={4} />
        </div>
        <div className="flex flex-col gap-6">
          <PanelSkeleton body="rows" rows={5} />
          <PanelSkeleton body="rows" rows={2} />
        </div>
      </div>
    </div>
  );
}
