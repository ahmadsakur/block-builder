import {
  GalleryVerticalEndIcon,
  HouseIcon,
  PaletteIcon,
  UsersIcon,
} from "lucide-react";
import type {
  Crumb,
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

export const WORKSPACES: Workspace[] = [
  {
    id: "acme",
    logo: <GalleryVerticalEndIcon />,
    name: "Acme Inc.",
    plan: "Pro plan",
  },
];

export function breadcrumbsFor(pathname: string): Crumb[] {
  const current = NAV_SECTIONS.flatMap((section) => section.items).find(
    (item) => item.href === pathname,
  );
  return [
    { href: "/dashboard", label: "Dashboard" },
    { label: current?.title ?? "Page" },
  ];
}
