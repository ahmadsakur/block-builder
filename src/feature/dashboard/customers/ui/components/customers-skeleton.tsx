import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import TableSkeleton from "@/components/_common/skeletons/table-skeleton";

export default function CustomersSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading customers"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton actions={1} />
      <TableSkeleton columns={6} rows={10} filters={2} />
    </div>
  );
}
