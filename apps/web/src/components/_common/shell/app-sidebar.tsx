"use client";

import type { AuthUser } from "@block-builder/shared/auth";
import { GalleryVerticalEndIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/_ui/sidebar";
import {
  AppNav,
  BrandMark,
  type NavSection,
} from "@/components/dashboardblocks/app-shell";
import { useSessionQuery } from "@/lib/auth/session-query";
import { cn } from "@/lib/utils";

const WORKSPACE_NAME = "Acme Inc.";

const RELAXED_NAV = cn(
  "gap-1 px-2",
  "[&_[data-slot=sidebar-menu]]:gap-1.5",
  "[&_[data-slot=sidebar-group-label]]:px-3",
  "[&_[data-slot=sidebar-menu-button]]:h-10",
  "[&_[data-slot=sidebar-menu-button]]:gap-3",
  "[&_[data-slot=sidebar-menu-button]]:rounded-xl",
  "[&_[data-slot=sidebar-menu-button]]:px-3",
  "[&_[data-slot=sidebar-menu-badge]]:top-2.5!",
  "[&_[data-slot=sidebar-menu-badge]]:right-2!",
);

function workspacePlan(user?: AuthUser): string | undefined {
  if (!user) return undefined;
  if (user.role === "root") return "Administrator";
  return `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)} plan`;
}

function WorkspaceIdentity() {
  const plan = workspacePlan(useSessionQuery().data?.user);

  return (
    <div
      data-slot="workspace-identity"
      className="pointer-events-none flex items-center gap-3 px-2 py-1 select-none"
    >
      <BrandMark className="size-9 rounded-xl">
        <GalleryVerticalEndIcon />
      </BrandMark>
      <span className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{WORKSPACE_NAME}</span>
        {plan && (
          <span className="text-muted-foreground truncate text-xs">{plan}</span>
        )}
      </span>
    </div>
  );
}

function SidebarNav({ sections }: { sections: NavSection[] }) {
  return <AppNav pathname={usePathname()} sections={sections} />;
}

type AppSidebarProps = {
  sections: NavSection[];
  footer?: ReactNode;
};

export default function AppSidebar({ sections, footer }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-5 pb-4">
        <WorkspaceIdentity />
      </SidebarHeader>
      <SidebarContent className={RELAXED_NAV}>
        <Suspense fallback={<AppNav pathname="" sections={sections} />}>
          <SidebarNav sections={sections} />
        </Suspense>
      </SidebarContent>
      {footer && (
        <SidebarFooter className="px-4 pb-4 group-data-[collapsible=icon]:hidden">
          {footer}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
