import type { Role } from "@block-builder/shared/auth";
import type { ReactNode } from "react";
import DashboardHeader from "@/components/_common/dashboard-header";
import AppSidebar from "@/components/_common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/_ui/sidebar";

type DashboardShellProps = {
  area: Role;
  children: ReactNode;
  headerActions?: ReactNode;
  sidebarFooter?: ReactNode;
};

export default function DashboardShell({
  area,
  children,
  headerActions,
  sidebarFooter,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar area={area} footer={sidebarFooter} />
      <SidebarInset className="min-w-0">
        <DashboardHeader area={area} actions={headerActions} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
