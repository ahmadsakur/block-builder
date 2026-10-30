"use client";

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

const WORKSPACES: Workspace[] = [
  {
    id: "acme",
    logo: <GalleryVerticalEndIcon />,
    name: "Acme Inc.",
    plan: "Pro plan",
  },
];

type AppSidebarProps = {
  sections: NavSection[];
  footer?: ReactNode;
};

export default function AppSidebar({ sections, footer }: AppSidebarProps) {
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
        <AppNav pathname={pathname} sections={sections} />
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}
