import { Skeleton } from "@/components/_ui/skeleton";
import { placeholderKeys } from "@/lib/placeholder-keys";

type FormSectionSkeletonProps = {
  fields?: number;
};

export default function FormSectionSkeleton({
  fields = 2,
}: FormSectionSkeletonProps) {
  return (
    <div className="grid gap-6 border-t pt-8 md:grid-cols-[16rem_1fr] md:gap-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex max-w-xl flex-col gap-6">
        {placeholderKeys(fields, "field").map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
