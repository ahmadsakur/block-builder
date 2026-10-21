"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/_common/brand-logo";
import { Button, buttonVariants } from "@/components/_ui/button";
import { ErrorPageLayout } from "@/components/dashboardblocks/error-pages";
import { NAV_SECTIONS } from "../sidebar/sidebar-nav";

const SUGGESTED_PAGES = NAV_SECTIONS.flatMap((section) => section.items).filter(
  (item) => item.href,
);

export default function NotFoundPage() {
  return (
    <ErrorPageLayout
      focusOnMount
      brand={<BrandLogo />}
      code="404"
      title="Page not found"
      description="The page may have moved, or the link has a typo."
    >
      <ul className="flex flex-col divide-y border-y">
        {SUGGESTED_PAGES.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href ?? "/"}
              className="hover:bg-muted focus-visible:ring-ring/50 -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 outline-none focus-visible:ring-3 focus-visible:ring-inset"
            >
              <span
                aria-hidden
                className="text-muted-foreground shrink-0 [&_svg]:size-4"
              >
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{item.title}</span>
              <ChevronRightIcon
                aria-hidden
                className="text-muted-foreground size-4 shrink-0"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard" className={buttonVariants()}>
          Go to dashboard
        </Link>
        <Button variant="ghost" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </ErrorPageLayout>
  );
}
