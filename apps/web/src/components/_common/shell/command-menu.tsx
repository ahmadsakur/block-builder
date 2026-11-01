"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/components/dashboardblocks/app-shell";
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuItem,
} from "@/components/dashboardblocks/command-menu";
import { useThemeTransition } from "@/hooks/use-theme-transition";
import { cn } from "@/lib/utils";

const ROOMY_MENU = cn(
  "rounded-2xl! sm:max-w-xl",
  "**:data-[slot=command]:p-0",
  "**:data-[slot=command-input-wrapper]:p-3",
  "**:data-[slot=input-group]:h-11! **:data-[slot=input-group]:rounded-xl!",
  "**:data-[slot=input-group]:border-0 **:data-[slot=input-group]:bg-muted",
  "**:data-[slot=command-list]:px-3 **:data-[slot=command-list]:pb-3",
  "**:[[cmdk-group-heading]]:px-3! **:[[cmdk-group-heading]]:pt-3! **:[[cmdk-group-heading]]:pb-2!",
  "**:data-[slot=command-item]:gap-3 **:data-[slot=command-item]:rounded-xl!",
  "**:data-[slot=command-item]:px-3 **:data-[slot=command-item]:py-2.5",
  "**:data-[slot=command-item]:data-selected:bg-primary/10",
  "**:data-[slot=command-item]:data-selected:text-primary",
  "**:data-[slot=command-item]:data-selected:**:[svg]:text-primary!",
  "**:data-[slot=command-separator]:hidden",
  "[&_.border-t]:border-t-0 [&_.border-t]:bg-muted/50 [&_.border-t]:px-5 [&_.border-t]:py-3",
);

function pageItems(pages: NavItem[]): CommandMenuItem[] {
  return pages.flatMap((item) =>
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
  pages: NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppCommandMenu({
  pages,
  open,
  onOpenChange,
}: AppCommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useThemeTransition();

  const groups: CommandMenuGroup[] = [
    { heading: "Pages", items: pageItems(pages) },
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
      className={ROOMY_MENU}
      open={open}
      onOpenChange={onOpenChange}
      groups={groups}
      onNavigate={(href) => router.push(href)}
      placeholder="Search pages and actions…"
    />
  );
}
