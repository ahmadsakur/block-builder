"use client";

import type { Role } from "@block-builder/shared/auth";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import AppCommandMenu from "@/components/_common/command-menu";
import ThemeToggle from "@/components/_common/theme-toggle";
import { Separator } from "@/components/_ui/separator";
import { SidebarTrigger } from "@/components/_ui/sidebar";
import {
  AppBreadcrumbs,
  AppHeader,
  SearchButton,
} from "@/components/dashboardblocks/app-shell";
import { breadcrumbsFor } from "./sidebar/sidebar-nav";

export default function DashboardHeader({
  area,
  actions,
}: {
  area: Role;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppHeader>
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <AppBreadcrumbs items={breadcrumbsFor(area, pathname)} />
      <div className="ml-auto flex items-center gap-2">
        <SearchButton onOpen={() => setSearchOpen(true)} />
        {actions}
        <ThemeToggle />
      </div>
      <AppCommandMenu
        area={area}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </AppHeader>
  );
}
