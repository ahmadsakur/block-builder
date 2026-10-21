"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/_ui/sidebar";
import {
  AppNav,
  SidebarUserMenu,
  WorkspaceSwitcher,
} from "@/components/dashboardblocks/app-shell";
import {
  CURRENT_USER,
  NAV_SECTIONS,
  USER_LINKS,
  WORKSPACES,
} from "./sidebar-nav";

export default function AppSidebar() {
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
      <SidebarFooter>
        <SidebarUserMenu
          links={USER_LINKS}
          onSignOut={() => {}}
          user={CURRENT_USER}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
