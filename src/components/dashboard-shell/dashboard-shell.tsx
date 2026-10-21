import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ShellHeader } from "./shell-header";
import { ShellSidebar } from "./shell-sidebar";

// Sidebar + main screen. The main screen is a top header over the page content.
// On mobile the sidebar becomes a sheet (shadcn Sidebar handles it).
export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellSidebar />
      <SidebarInset className="min-w-0">
        <ShellHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
