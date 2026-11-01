import FormSectionSkeleton from "@/components/_common/skeletons/form-section-skeleton";
import PageHeaderSkeleton from "@/components/_common/skeletons/page-header-skeleton";

export default function PlanDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading plan"
      className="flex w-full flex-col gap-6"
    >
      <PageHeaderSkeleton />
      <FormSectionSkeleton fields={2} />
      <FormSectionSkeleton fields={1} />
    </div>
  );
}
