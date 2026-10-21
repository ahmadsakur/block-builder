import type { Metadata } from "next";
import { Dashboard1 } from "@/components/dashboardblocks/dashboards/dashboard-01";

export const metadata: Metadata = { title: "Home" };

// Mock data is generated relative to a fixed day so server and client render
// the same numbers. Swap for real queries once a backend exists.
const TODAY = new Date(Date.UTC(2026, 9, 21));

export default function DashboardHomePage() {
  return <Dashboard1 title="Overview" today={TODAY} />;
}
