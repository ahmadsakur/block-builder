import {
  HouseIcon,
  LayersIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { AreaNav } from "@/components/_common/shell/area-nav";

export const BACK_OFFICE_NAV: AreaNav = {
  root: { href: "/back-office", label: "Back office" },
  sections: [
    {
      items: [
        { href: "/back-office/home", icon: <HouseIcon />, title: "Home" },
      ],
    },
    {
      label: "Access",
      items: [
        { href: "/back-office/users", icon: <UsersIcon />, title: "Users" },
        { href: "/back-office/plans", icon: <LayersIcon />, title: "Plans" },
        {
          href: "/back-office/permissions",
          icon: <ShieldCheckIcon />,
          title: "Permissions",
        },
      ],
    },
  ],
  account: [
    { href: "/back-office/profile", icon: <UserIcon />, title: "Profile" },
  ],
};
