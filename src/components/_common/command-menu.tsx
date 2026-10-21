"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuItem,
} from "@/components/dashboardblocks/command-menu";
import { ALL_PAGES } from "./sidebar/sidebar-nav";

const PAGE_ITEMS: CommandMenuItem[] = ALL_PAGES.flatMap((item) =>
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

type AppCommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppCommandMenu({
  open,
  onOpenChange,
}: AppCommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const groups: CommandMenuGroup[] = [
    { heading: "Pages", items: PAGE_ITEMS },
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
