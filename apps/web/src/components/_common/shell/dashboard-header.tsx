"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import ThemeToggle from "@/components/_common/theme-toggle";
import { Separator } from "@/components/_ui/separator";
import { SidebarTrigger } from "@/components/_ui/sidebar";
import {
  AppBreadcrumbs,
  AppHeader,
  SearchButton,
} from "@/components/dashboardblocks/app-shell";
import { type AreaNav, areaBreadcrumbs, areaPages } from "./area-nav";
import AppCommandMenu from "./command-menu";

type DashboardHeaderProps = {
  nav: AreaNav;
  actions?: ReactNode;
};

export default function DashboardHeader({
  nav,
  actions,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppHeader>
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <AppBreadcrumbs items={areaBreadcrumbs(nav, pathname)} />
      <div className="ml-auto flex items-center gap-2">
        <SearchButton onOpen={() => setSearchOpen(true)} />
        {actions}
        <ThemeToggle />
      </div>
      <AppCommandMenu
        pages={areaPages(nav)}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </AppHeader>
  );
}
