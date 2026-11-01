import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";
import { cn } from "@/lib/utils";

type PanelSkeletonProps = {
  body: "chart" | "rows" | "bars" | "stats";
  rows?: number;
  className?: string;
};

const CHART_HEIGHTS = [42, 58, 35, 66, 52, 74, 61, 80, 57, 69, 88, 72];

const BAR_WIDTHS = ["w-full", "w-4/5", "w-3/5", "w-2/5", "w-1/4"];

function PanelBody({ body, rows = 4 }: Omit<PanelSkeletonProps, "className">) {
  if (body === "chart") {
    return (
      <div className="flex h-56 items-end gap-2 border-b pb-px">
        {CHART_HEIGHTS.map((height) => (
          <Skeleton
            key={height}
            className="flex-1 rounded-sm"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }

  if (body === "bars") {
    return (
      <div className="flex flex-col gap-3">
        {BAR_WIDTHS.slice(0, rows).map((width) => (
          <div key={width} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className={cn("h-6", width)} />
          </div>
        ))}
      </div>
    );
  }

  if (body === "stats") {
    return (
      <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-4">
        {placeholderKeys(4, "stat").map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {placeholderKeys(rows, "row").map((key) => (
        <li
          key={key}
          className="flex items-center gap-4 border-b py-3 last:border-b-0"
        >
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="ml-auto h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

export default function PanelSkeleton({
  body,
  rows,
  className,
}: PanelSkeletonProps) {
  return (
    <div className={cn("@container flex flex-col gap-4", className)}>
      {body !== "stats" && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
      )}
      <PanelBody body={body} rows={rows} />
    </div>
  );
}
