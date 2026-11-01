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
  const pages = areaPages(nav);
  const current = pages.find((item) => item.href === pathname);
  if (current) return [nav.root, { label: current.title }];
  const parent = pages.find((item) => pathname.startsWith(`${item.href}/`));
  return parent
    ? [
        nav.root,
        { href: parent.href, label: parent.title },
        { label: "Details" },
      ]
    : [nav.root, { label: "Page" }];
}
