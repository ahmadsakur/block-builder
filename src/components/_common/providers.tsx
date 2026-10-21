"use client";

import NextLink from "next/link";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/_ui/tooltip";
import { LinkProvider } from "@/components/dashboardblocks/link";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LinkProvider component={NextLink}>
        <TooltipProvider>{children}</TooltipProvider>
      </LinkProvider>
    </ThemeProvider>
  );
}
