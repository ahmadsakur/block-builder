"use client";

import type { Role } from "@block-builder/shared/auth";
import { MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuItem,
} from "@/components/dashboardblocks/command-menu";
import { pagesFor } from "./sidebar/sidebar-nav";

function pageItems(role: Role): CommandMenuItem[] {
  return pagesFor(role).flatMap((item) =>
    item.href
      ? [
          {
            href: item.href,
            icon: item.icon,
            id: `page-${item.href}`,
            label: item.title,
          },
        ]
      : [],
  );
}

type AppCommandMenuProps = {
  area: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppCommandMenu({
  area,
  open,
  onOpenChange,
}: AppCommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const groups: CommandMenuGroup[] = [
    { heading: "Pages", items: pageItems(area) },
    {
      heading: "Theme",
      items: [
        {
          icon: <SunIcon />,
          id: "theme-light",
          keywords: ["appearance", "mode"],
          label: "Switch to light theme",
          onSelect: () => setTheme("light"),
        },
        {
          icon: <MoonIcon />,
          id: "theme-dark",
          keywords: ["appearance", "mode"],
          label: "Switch to dark theme",
          onSelect: () => setTheme("dark"),
        },
      ],
    },
  ];

  return (
    <CommandMenu
      open={open}
      onOpenChange={onOpenChange}
      groups={groups}
      onNavigate={(href) => router.push(href)}
      placeholder="Search pages and actions…"
    />
  );
}
