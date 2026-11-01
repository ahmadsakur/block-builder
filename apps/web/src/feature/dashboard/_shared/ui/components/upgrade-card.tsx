"use client";

import { ArrowRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/_ui/button";

type UpgradeCardProps = {
  href: string;
  onDismiss: () => void;
};

export default function UpgradeCard({ href, onDismiss }: UpgradeCardProps) {
  return (
    <aside
      aria-label="Upgrade to Pro"
      className="from-primary/20 via-muted to-muted relative flex flex-col gap-3 rounded-2xl bg-linear-to-br p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="bg-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
          Pro
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          className="bg-background hover:bg-background/80 -mt-1 -mr-1 rounded-full"
          onClick={onDismiss}
        >
          <XIcon />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold tracking-tight">Upgrade to Pro</p>
        <p className="text-muted-foreground text-sm">
          Unlock analytics, CSV exports and higher limits.
        </p>
      </div>
      <Link
        href={href}
        className={buttonVariants({
          variant: "ghost",
          className:
            "bg-background hover:bg-background/80 mt-1 h-10 w-full rounded-full",
        })}
      >
        Upgrade plan
        <ArrowRightIcon data-icon="inline-end" />
      </Link>
    </aside>
  );
}
