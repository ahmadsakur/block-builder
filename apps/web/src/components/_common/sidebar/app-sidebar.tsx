"use client";

import type { Role } from "@block-builder/shared/auth";
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
import { NAV_BY_ROLE, WORKSPACES } from "./sidebar-nav";

export default function AppSidebar({
  area,
  footer,
}: {
  area: Role;
  footer?: ReactNode;
}) {
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
        <AppNav pathname={pathname} sections={NAV_BY_ROLE[area].sections} />
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}
