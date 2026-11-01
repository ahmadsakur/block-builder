import type { ReactNode } from "react";
import { Tag } from "@/components/dashboardblocks/tag";
import { cn } from "@/lib/utils";

export function ProBadge({ className }: { className?: string }) {
  return (
    <Tag
      title="Available on Pro"
      className={cn("bg-primary text-primary-foreground", className)}
    >
      Pro
    </Tag>
  );
}

type ProLockProps = {
  locked: boolean;
  children: ReactNode;
  className?: string;
};

export default function ProLock({ locked, children, className }: ProLockProps) {
  if (!locked) return children;

  return (
    <span
      data-slot="pro-lock"
      className={cn("relative inline-flex w-fit", className)}
    >
      <span inert className="inline-flex w-full opacity-50 select-none">
        {children}
      </span>
      <ProBadge className="absolute -end-2 -top-2 shadow-xs" />
    </span>
  );
}
