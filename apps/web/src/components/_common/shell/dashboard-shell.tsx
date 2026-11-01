import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/_ui/sidebar";
import AppSidebar from "./app-sidebar";
import type { AreaNav } from "./area-nav";
import DashboardHeader from "./dashboard-header";
import UserMenu from "./user-menu";

type DashboardShellProps = {
  nav: AreaNav;
  children: ReactNode;
  headerActions?: ReactNode;
};

export default function DashboardShell({
  nav,
  children,
  headerActions,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        sections={nav.sections}
        footer={<UserMenu links={nav.account} />}
      />
      <SidebarInset className="min-w-0">
        <DashboardHeader nav={nav} actions={headerActions} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
