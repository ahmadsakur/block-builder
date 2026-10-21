import type { ReactNode } from "react";
import DashboardHeader from "@/components/_common/dashboard-header";
import AppSidebar from "@/components/_common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/_ui/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
