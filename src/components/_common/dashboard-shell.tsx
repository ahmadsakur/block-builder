import type { ReactNode } from "react";
import DashboardHeader from "@/components/_common/dashboard-header";
import AppSidebar from "@/components/_common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/_ui/sidebar";

type DashboardShellProps = {
  children: ReactNode;
  headerActions?: ReactNode;
  sidebarFooter?: ReactNode;
};

export default function DashboardShell({
  children,
  headerActions,
  sidebarFooter,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar footer={sidebarFooter} />
      <SidebarInset className="min-w-0">
        <DashboardHeader actions={headerActions} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
