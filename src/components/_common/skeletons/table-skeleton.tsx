import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";
import { cn } from "@/lib/utils";

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  filters?: number;
};

const CELL_WIDTHS = ["w-32", "w-20", "w-24", "w-16", "w-28", "w-12"];

export default function TableSkeleton({
  columns = 5,
  rows = 10,
  filters = 2,
}: TableSkeletonProps) {
  const cells = CELL_WIDTHS.slice(0, columns);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {placeholderKeys(filters, "filter").map((key) => (
            <Skeleton key={key} className="h-8 w-28" />
          ))}
          <Skeleton className="h-8 w-56" />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted/50 flex items-center gap-6 border-b px-4 py-3">
          <Skeleton className="size-4 rounded-sm" />
          {cells.map((width) => (
            <Skeleton key={width} className="h-3.5 w-16 flex-1" />
          ))}
        </div>
        {placeholderKeys(rows, "row").map((key) => (
          <div
            key={key}
            className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0"
          >
            <Skeleton className="size-4 rounded-sm" />
            {cells.map((width) => (
              <div key={width} className="flex-1">
                <Skeleton className={cn("h-4 max-w-full", width)} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </div>
  );
}
