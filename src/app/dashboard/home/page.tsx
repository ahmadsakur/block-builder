import type { Metadata } from "next";
import HomeContainer from "@/feature/dashboard/home/ui/home.container";

export const metadata: Metadata = { title: "Home" };

export default function DashboardHomePage() {
  return <HomeContainer />;
}
