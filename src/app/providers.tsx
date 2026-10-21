"use client";

import NextLink from "next/link";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LinkProvider } from "@/components/dashboardblocks/link";
import { TooltipProvider } from "@/components/ui/tooltip";

// App-wide client providers. LinkProvider makes dashboardblocks links use
// Next.js client navigation instead of plain <a> reloads.
export function Providers({ children }: { children: ReactNode }) {
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
