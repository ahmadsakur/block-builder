import {
  ChartLineIcon,
  FolderKanbanIcon,
  HouseIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import type { AreaNav } from "@/components/_common/shell/area-nav";
import { UPGRADE_PATH } from "@/lib/auth/routes";
import NavLockBadge from "../ui/nav-lock-badge";

export const DASHBOARD_NAV: AreaNav = {
  root: { href: "/dashboard", label: "Dashboard" },
  sections: [
    {
      items: [
        { href: "/dashboard/home", icon: <HouseIcon />, title: "Home" },
        {
          href: "/dashboard/projects",
          icon: <FolderKanbanIcon />,
          title: "Projects",
        },
        {
          badge: <NavLockBadge permission="analytics.view" />,
          href: "/dashboard/analytics",
          icon: <ChartLineIcon />,
          title: "Analytics",
        },
      ],
    },
    {
      label: "Plan",
      items: [{ href: UPGRADE_PATH, icon: <SparklesIcon />, title: "Upgrade" }],
    },
  ],
  account: [
    { href: "/dashboard/profile", icon: <UserIcon />, title: "Profile" },
  ],
};
