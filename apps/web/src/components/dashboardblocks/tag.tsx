import type { ComponentProps, ReactNode } from "react";
import type { StatusTone } from "@/components/dashboardblocks/status-label";
import { statusToneClasses } from "@/components/dashboardblocks/status-label";
import { formatNumber } from "@/lib/dashboardblocks/format";

import { cn } from "@/lib/utils";

const tagToneClasses: Record<StatusTone, string> = {
  bad: "bg-destructive/5 dark:bg-destructive/10",
  good: "bg-success/5 dark:bg-success/10",
  info: "bg-info/5 dark:bg-info/10",
  neutral: "text-foreground/70 bg-current/10",
  warning: "bg-warning/5 dark:bg-warning/10",
};

interface TagProps extends ComponentProps<"span"> {
  /** Drawn before the count, such as a live dot. */
  indicator?: ReactNode;
  /** `neutral` for a plain count; another tone when it needs attention. @default 'neutral' */
  tone?: StatusTone;
}

function Tag({
  children,
  className,
  indicator,
  tone = "neutral",
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-tone={tone}
      className={cn(
        "inline-flex h-5 min-w-5 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap tabular-nums",
        tone !== "neutral" && statusToneClasses[tone],
        tagToneClasses[tone],
        className,
      )}
      {...props}
    >
      {indicator}
      {children}
    </span>
  );
}

/** Draws a plain number or string as a `Tag`; any other node as it is. */
function renderTag(badge: ReactNode) {
  if (typeof badge === "number") return <Tag>{formatNumber(badge)}</Tag>;
  if (typeof badge === "string") return <Tag>{badge}</Tag>;
  return badge;
}

export type { TagProps };
export { renderTag, Tag };
