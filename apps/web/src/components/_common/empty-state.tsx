import type { ReactNode } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/_ui/empty";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "error";
  bordered?: boolean;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "default",
  bordered = false,
  className,
}: EmptyStateProps) {
  return (
    <Empty
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none",
        bordered && "border",
        className,
      )}
    >
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          aria-hidden
          className={cn(
            "size-12 rounded-full [&_svg:not([class*='size-'])]:size-5",
            tone === "error"
              ? "bg-destructive/10 text-destructive"
              : "text-muted-foreground",
          )}
        >
          {icon}
        </EmptyMedia>
        <EmptyTitle className="text-base">{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
