import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import TableSkeleton from "@/components/_common/skeletons/table-skeleton";

export default function UsersSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading users"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton />
      <TableSkeleton columns={4} rows={10} filters={1} />
    </div>
  );
}
