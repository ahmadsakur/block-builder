import type { Role } from "@block-builder/shared/auth";
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

export type AreaNav = {
  root: Crumb;
  sections: NavSection[];
  account: NavItem[];
};

export const NAV_BY_ROLE: Record<Role, AreaNav> = {
  root: {
    root: { href: "/dashboard", label: "Dashboard" },
    sections: [
      {
        items: [
          { href: "/dashboard/home", icon: <HouseIcon />, title: "Home" },
          {
            href: "/dashboard/customers",
            icon: <UsersIcon />,
            title: "Customers",
          },
        ],
      },
      {
        label: "Dev",
        items: [
          { href: "/tokens", icon: <PaletteIcon />, title: "Design tokens" },
        ],
      },
    ],
    account: [
      { href: "/dashboard/profile", icon: <UserIcon />, title: "Profile" },
    ],
  },
  user: {
    root: { href: "/app", label: "App" },
    sections: [
      { items: [{ href: "/app/home", icon: <HouseIcon />, title: "Home" }] },
    ],
    account: [{ href: "/app/profile", icon: <UserIcon />, title: "Profile" }],
  },
};

export function pagesFor(role: Role): NavItem[] {
  const nav = NAV_BY_ROLE[role];
  return [...nav.sections.flatMap((section) => section.items), ...nav.account];
}

export const WORKSPACES: Workspace[] = [
  {
    id: "acme",
    logo: <GalleryVerticalEndIcon />,
    name: "Acme Inc.",
    plan: "Pro plan",
  },
];

export function breadcrumbsFor(role: Role, pathname: string): Crumb[] {
  const current = pagesFor(role).find((item) => item.href === pathname);
  return [NAV_BY_ROLE[role].root, { label: current?.title ?? "Page" }];
}
