"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import { useThemeTransition } from "@/hooks/use-theme-transition";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useThemeTransition();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}
