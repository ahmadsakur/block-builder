import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";

export default function PermissionsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading permissions"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton />
      <PanelSkeleton body="rows" rows={6} />
    </div>
  );
}
