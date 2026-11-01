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
  sidebarFooter?: ReactNode;
};

export default function DashboardShell({
  nav,
  children,
  headerActions,
  sidebarFooter,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar sections={nav.sections} footer={sidebarFooter} />
      <SidebarInset className="min-w-0">
        <DashboardHeader
          nav={nav}
          actions={headerActions}
          account={<UserMenu links={nav.account} />}
        />
        <div className="flex flex-1 flex-col gap-6 px-4 pt-2 pb-10 md:px-8 lg:px-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
