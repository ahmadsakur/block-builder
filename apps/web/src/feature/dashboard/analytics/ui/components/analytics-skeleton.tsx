import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";
import ReportSkeleton from "./report-skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="@container flex w-full flex-col gap-8">
      <PageHeaderSkeleton />
      <ReportSkeleton />
    </div>
  );
}
