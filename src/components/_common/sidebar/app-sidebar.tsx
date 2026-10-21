"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/_ui/sidebar";
import {
  AppNav,
  WorkspaceSwitcher,
} from "@/components/dashboardblocks/app-shell";
import { NAV_SECTIONS, WORKSPACES } from "./sidebar-nav";

export default function AppSidebar({ footer }: { footer?: ReactNode }) {
  const pathname = usePathname();
  const [workspaceId, setWorkspaceId] = useState(WORKSPACES[0]?.id ?? "");

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher
          onValueChange={setWorkspaceId}
          value={workspaceId}
          workspaces={WORKSPACES}
        />
      </SidebarHeader>
      <SidebarContent>
        <AppNav pathname={pathname} sections={NAV_SECTIONS} />
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}
