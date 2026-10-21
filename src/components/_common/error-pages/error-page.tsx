"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/_ui/button";
import { ErrorPageLayout } from "@/components/dashboardblocks/error-pages";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

function errorDigest(error: unknown) {
  if (error instanceof Error && "digest" in error) {
    return typeof error.digest === "string" ? error.digest : undefined;
  }
  return undefined;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const digest = errorDigest(error);

  return (
    <ErrorPageLayout
      focusOnMount
      code="500"
      title="Something went wrong"
      description="This page didn't load, and it's not something you did. Try again, and if it keeps happening, send the error ID to support."
      footer={
        digest && (
          <p className="text-muted-foreground text-xs">
            Error ID: <code className="font-mono">{digest}</code>
          </p>
        )
      }
    >
      <div className="flex flex-wrap gap-2">
        <Button onClick={retry}>Try again</Button>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          Go to dashboard
        </Link>
      </div>
    </ErrorPageLayout>
  );
}
