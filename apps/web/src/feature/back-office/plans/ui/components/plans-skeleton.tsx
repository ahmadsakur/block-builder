import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";

export default function PlansSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading plans"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton actions={1} />
      <PanelSkeleton body="rows" rows={2} />
    </div>
  );
}
