import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";

export default function PlanDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading plan"
      className="flex w-full flex-col gap-8"
    >
      <PageHeaderSkeleton actions={2} />
      <PanelSkeleton body="rows" rows={2} />
    </div>
  );
}
