"use client";

import type { AuthUser } from "@block-builder/shared/auth";
import { GalleryVerticalEndIcon } from "lucide-react";
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
  type NavSection,
  type Workspace,
  WorkspaceSwitcher,
} from "@/components/dashboardblocks/app-shell";
import { useSessionQuery } from "@/lib/auth/session-query";

const WORKSPACE: Workspace = {
  id: "acme",
  logo: <GalleryVerticalEndIcon />,
  name: "Acme Inc.",
};

function workspacePlan(user?: AuthUser): string | undefined {
  if (!user) return undefined;
  if (user.role === "root") return "Administrator";
  return `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)} plan`;
}

type AppSidebarProps = {
  sections: NavSection[];
  footer?: ReactNode;
};

export default function AppSidebar({ sections, footer }: AppSidebarProps) {
  const pathname = usePathname();
  const [workspaceId, setWorkspaceId] = useState(WORKSPACE.id);
  const plan = workspacePlan(useSessionQuery().data?.user);

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher
          onValueChange={setWorkspaceId}
          value={workspaceId}
          workspaces={[{ ...WORKSPACE, plan }]}
        />
      </SidebarHeader>
      <SidebarContent>
        <AppNav pathname={pathname} sections={sections} />
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}
