import PanelSkeleton from "@/components/_common/skeletons/panel-skeleton";

export default function ReportSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading analytics"
      className="flex flex-col gap-12"
    >
      <PanelSkeleton body="stats" />
      <PanelSkeleton body="chart" />
    </div>
  );
}
