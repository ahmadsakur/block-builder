import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";

export default function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading the dashboard"
      className="@container flex w-full flex-col gap-8"
    >
      <PageHeaderSkeleton actions={2} />
      <div className="grid gap-x-8 gap-y-12 @4xl:grid-cols-3">
        <PanelSkeleton body="stats" className="@4xl:col-span-3" />
        <PanelSkeleton body="chart" className="@4xl:col-span-2" />
        <PanelSkeleton body="bars" rows={3} />
        <PanelSkeleton body="rows" rows={5} className="@4xl:col-span-2" />
        <PanelSkeleton body="bars" rows={4} />
        <PanelSkeleton body="rows" rows={4} className="@4xl:col-span-2" />
        <PanelSkeleton body="bars" rows={3} />
      </div>
    </div>
  );
}
