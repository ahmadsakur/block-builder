"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/_common/theme-toggle";
import { Separator } from "@/components/_ui/separator";
import { SidebarTrigger } from "@/components/_ui/sidebar";
import {
  AppBreadcrumbs,
  AppHeader,
  NotificationsButton,
  SearchButton,
} from "@/components/dashboardblocks/app-shell";
import { breadcrumbsFor } from "./sidebar/sidebar-nav";

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <AppHeader>
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <AppBreadcrumbs items={breadcrumbsFor(pathname)} />
      <div className="ml-auto flex items-center gap-2">
        <SearchButton onOpen={() => {}} />
        <NotificationsButton count={3} onClick={() => {}} />
        <ThemeToggle />
      </div>
    </AppHeader>
  );
}
