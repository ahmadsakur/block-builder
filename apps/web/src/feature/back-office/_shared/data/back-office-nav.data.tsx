import { HouseIcon, UserIcon, UsersIcon } from "lucide-react";
import type { AreaNav } from "@/components/_common/shell/area-nav";

export const BACK_OFFICE_NAV: AreaNav = {
  root: { href: "/back-office", label: "Back office" },
  sections: [
    {
      items: [
        { href: "/back-office/home", icon: <HouseIcon />, title: "Home" },
        {
          href: "/back-office/customers",
          icon: <UsersIcon />,
          title: "Customers",
        },
      ],
    },
  ],
  account: [
    { href: "/back-office/profile", icon: <UserIcon />, title: "Profile" },
  ],
};
