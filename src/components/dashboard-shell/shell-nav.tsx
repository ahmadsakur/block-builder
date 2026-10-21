import { GalleryVerticalEndIcon, HouseIcon, PaletteIcon } from "lucide-react";
import type {
  AppUser,
  Crumb,
  NavSection,
  UserMenuLink,
  Workspace,
} from "@/components/dashboardblocks/app-shell";

// Sidebar data. Placeholder until the mock data layer lands.

export const navSections: NavSection[] = [
  {
    items: [{ href: "/dashboard/home", icon: <HouseIcon />, title: "Home" }],
  },
  {
    label: "Dev",
    items: [{ href: "/tokens", icon: <PaletteIcon />, title: "Design tokens" }],
  },
];

export const workspaces: Workspace[] = [
  {
    id: "acme",
    logo: <GalleryVerticalEndIcon />,
    name: "Acme Inc.",
    plan: "Pro plan",
  },
];

export const user: AppUser = { email: "jane@acme.com", name: "Jane Doe" };

export const userLinks: UserMenuLink[] = [];

export function breadcrumbsFor(pathname: string): Crumb[] {
  const current = navSections
    .flatMap((section) => section.items)
    .find((item) => item.href === pathname);
  return [
    { href: "/dashboard", label: "Dashboard" },
    { label: current?.title ?? "Page" },
  ];
}
