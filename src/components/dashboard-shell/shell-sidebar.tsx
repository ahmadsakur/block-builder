"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AppNav,
  SidebarUserMenu,
  WorkspaceSwitcher,
} from "@/components/dashboardblocks/app-shell";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navSections, user, userLinks, workspaces } from "./shell-nav";

export function ShellSidebar() {
  const pathname = usePathname();
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id ?? "");

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher
          onValueChange={setWorkspaceId}
          value={workspaceId}
          workspaces={workspaces}
        />
      </SidebarHeader>
      <SidebarContent>
        <AppNav pathname={pathname} sections={navSections} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu links={userLinks} onSignOut={() => {}} user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
