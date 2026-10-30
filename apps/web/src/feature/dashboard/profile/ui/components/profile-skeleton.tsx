import FormSectionSkeleton from "@/components/_common/skeletons/form-section-skeleton";
import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import { Skeleton } from "@/components/_ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your profile"
      className="flex w-full max-w-5xl flex-col gap-8"
    >
      <PageHeaderSkeleton />
      <div className="grid gap-6 border-t pt-8 md:grid-cols-[16rem_1fr] md:gap-10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex max-w-xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-44" />
            </div>
          </div>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <FormSectionSkeleton fields={3} />
      <FormSectionSkeleton fields={1} />
    </div>
  );
}
