import { HouseIcon, UserIcon } from "lucide-react";
import type { AreaNav } from "@/components/_common/shell/area-nav";

export const DASHBOARD_NAV: AreaNav = {
  root: { href: "/dashboard", label: "Dashboard" },
  sections: [
    {
      items: [{ href: "/dashboard/home", icon: <HouseIcon />, title: "Home" }],
    },
  ],
  account: [
    { href: "/dashboard/profile", icon: <UserIcon />, title: "Profile" },
  ],
};
