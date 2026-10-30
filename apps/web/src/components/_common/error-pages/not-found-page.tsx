"use client";

import Link from "next/link";
import BrandLogo from "@/components/_common/brand-logo";
import { Button, buttonVariants } from "@/components/_ui/button";
import { ErrorPageLayout } from "@/components/dashboardblocks/error-pages";

export default function NotFoundPage() {
  return (
    <ErrorPageLayout
      focusOnMount
      brand={<BrandLogo />}
      code="404"
      title="Page not found"
      description="The page may have moved, or the link has a typo."
    >
      <div className="flex flex-wrap gap-2">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Button variant="ghost" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </ErrorPageLayout>
  );
}
