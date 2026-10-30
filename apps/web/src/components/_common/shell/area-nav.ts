import type {
  Crumb,
  NavItem,
  NavSection,
} from "@/components/dashboardblocks/app-shell";

export type AreaNav = {
  root: Crumb;
  sections: NavSection[];
  account: NavItem[];
};

export function areaPages(nav: AreaNav): NavItem[] {
  return [...nav.sections.flatMap((section) => section.items), ...nav.account];
}

export function areaBreadcrumbs(nav: AreaNav, pathname: string): Crumb[] {
  const current = areaPages(nav).find((item) => item.href === pathname);
  return [nav.root, { label: current?.title ?? "Page" }];
}
