"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, Suspense, useState } from "react";
import ThemeToggle from "@/components/_common/theme-toggle";
import { Separator } from "@/components/_ui/separator";
import { SidebarTrigger } from "@/components/_ui/sidebar";
import {
  AppBreadcrumbs,
  AppHeader,
  SearchButton,
} from "@/components/dashboardblocks/app-shell";
import { cn } from "@/lib/utils";
import { type AreaNav, areaBreadcrumbs, areaPages } from "./area-nav";
import AppCommandMenu from "./command-menu";

const HEADER_CONTROLS = cn(
  "ml-auto flex items-center gap-2",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:h-9 [&_:is([data-slot=button],[data-slot$=-trigger])]:min-w-9",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:rounded-full!",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:border-0!",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:shadow-none!",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:bg-muted!",
  "[&_:is([data-slot=button],[data-slot$=-trigger])]:text-foreground!",
  "[&_:is([data-slot=button],[data-slot$=-trigger]):hover]:bg-accent!",
  "[&_:is([data-slot=button],[data-slot$=-trigger])[aria-expanded=true]]:bg-accent!",
  "[&_[data-slot=kbd]]:bg-background",
  "[&_[data-slot=avatar]]:size-full",
  "[&_[data-slot=avatar]]:after:hidden",
  "[&_[data-slot=avatar-fallback]]:bg-transparent",
  "[&_[data-slot=avatar-fallback]]:text-foreground",
  "[&_[data-slot=avatar-fallback]]:text-xs",
  "[&_[data-slot=avatar-fallback]]:font-medium",
);

type DashboardHeaderProps = {
  nav: AreaNav;
  actions?: ReactNode;
  account?: ReactNode;
};

function HeaderBreadcrumbs({ nav }: { nav: AreaNav }) {
  return <AppBreadcrumbs items={areaBreadcrumbs(nav, usePathname())} />;
}

export default function DashboardHeader({
  nav,
  actions,
  account,
}: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppHeader className="h-16 gap-3 border-b-0 px-4 md:px-8 lg:px-10">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-1 data-vertical:h-4 data-vertical:self-auto"
      />
      <Suspense fallback={<AppBreadcrumbs items={[nav.root]} />}>
        <HeaderBreadcrumbs nav={nav} />
      </Suspense>
      <div className={HEADER_CONTROLS}>
        <SearchButton onOpen={() => setSearchOpen(true)} />
        {actions}
        <ThemeToggle />
        {account}
      </div>
      <AppCommandMenu
        pages={areaPages(nav)}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </AppHeader>
  );
}
