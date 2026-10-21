import { GalleryVerticalEndIcon, HouseIcon, PaletteIcon } from "lucide-react";
import type {
  AppUser,
  Crumb,
  NavSection,
  UserMenuLink,
  Workspace,
} from "@/components/dashboardblocks/app-shell";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ href: "/dashboard/home", icon: <HouseIcon />, title: "Home" }],
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

export const CURRENT_USER: AppUser = {
  email: "jane@acme.com",
  name: "Jane Doe",
};

export const USER_LINKS: UserMenuLink[] = [];

export function breadcrumbsFor(pathname: string): Crumb[] {
  const current = NAV_SECTIONS.flatMap((section) => section.items).find(
    (item) => item.href === pathname,
  );
  return [
    { href: "/dashboard", label: "Dashboard" },
    { label: current?.title ?? "Page" },
  ];
}
