import type { Metadata } from "next";
import PlansContainer from "@/feature/back-office/plans/list/ui/plans.container";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return <PlansContainer />;
}
