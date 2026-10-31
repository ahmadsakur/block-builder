import type { Metadata } from "next";
import AnalyticsContainer from "@/feature/dashboard/analytics/ui/analytics.container";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return <AnalyticsContainer />;
}
