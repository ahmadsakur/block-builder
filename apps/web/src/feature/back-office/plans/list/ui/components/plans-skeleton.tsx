import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import TableSkeleton from "@/components/_common/skeletons/table-skeleton";

export default function PlansSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading plans"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton actions={2} />
      <TableSkeleton rows={3} />
    </div>
  );
}
