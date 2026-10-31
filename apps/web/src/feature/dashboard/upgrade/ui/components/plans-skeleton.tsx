import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";

export default function PlansSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading plans"
      className="grid gap-4 @2xl:grid-cols-2"
    >
      {placeholderKeys(2, "plan").map((key) => (
        <div key={key} className="flex flex-col gap-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-col gap-2 border-t pt-3">
            {placeholderKeys(3, "feature").map((row) => (
              <div key={row} className="flex justify-between gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
      ))}
    </div>
  );
}
