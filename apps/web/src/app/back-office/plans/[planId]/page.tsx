import type { Metadata } from "next";
import PlanDetailContainer from "@/feature/back-office/plans/detail/ui/plan-detail.container";

export const metadata: Metadata = { title: "Plan" };

export default async function PlanDetailPage(
  props: PageProps<"/back-office/plans/[planId]">,
) {
  const { planId } = await props.params;
  return <PlanDetailContainer planId={planId} />;
}
