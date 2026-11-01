import type { Metadata } from "next";
import ProRequiredContainer from "@/feature/dashboard/pro-required/ui/pro-required.container";

export const metadata: Metadata = { title: "Pro required" };

export default function ProRequiredPage() {
  return <ProRequiredContainer />;
}
