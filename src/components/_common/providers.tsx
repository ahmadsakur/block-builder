"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import NextLink from "next/link";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/_ui/tooltip";
import { LinkProvider } from "@/components/dashboardblocks/link";
import { getQueryClient } from "@/lib/query-client";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <QueryClientProvider client={getQueryClient()}>
          <LinkProvider component={NextLink}>
            <TooltipProvider>{children}</TooltipProvider>
          </LinkProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
