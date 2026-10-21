import {
  GalleryVerticalEndIcon,
  HouseIcon,
  PaletteIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type {
  Crumb,
  NavItem,
  NavSection,
  Workspace,
} from "@/components/dashboardblocks/app-shell";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/dashboard/home", icon: <HouseIcon />, title: "Home" },
      { href: "/dashboard/customers", icon: <UsersIcon />, title: "Customers" },
    ],
  },
  {
    label: "Dev",
    items: [{ href: "/tokens", icon: <PaletteIcon />, title: "Design tokens" }],
  },
];

export const ACCOUNT_PAGES: NavItem[] = [
  { href: "/dashboard/profile", icon: <UserIcon />, title: "Profile" },
];

export const ALL_PAGES: NavItem[] = [
  ...NAV_SECTIONS.flatMap((section) => section.items),
  ...ACCOUNT_PAGES,
];

export const WORKSPACES: Workspace[] = [
  {
    id: "acme",
    logo: <GalleryVerticalEndIcon />,
    name: "Acme Inc.",
    plan: "Pro plan",
  },
];

export function breadcrumbsFor(pathname: string): Crumb[] {
  const current = ALL_PAGES.find((item) => item.href === pathname);
  return [
    { href: "/dashboard", label: "Dashboard" },
    { label: current?.title ?? "Page" },
  ];
}
