import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/_ui/card";
import { cn } from "@/lib/utils";

export const FLAT_SECTION = cn(
  "rounded-2xl shadow-none ring-foreground/8",
  "[&_.border-t]:border-t-0 [&_.border-b]:border-b-0",
  "[&_[data-slot=kpi]]:pt-0",
  "[&_:is(h2,[data-slot=kpi-title])]:text-foreground",
  "[&_:is(h2,[data-slot=kpi-title])]:text-base",
  "[&_:is(h2,[data-slot=kpi-title])]:font-semibold",
  "[&_:is(h2,[data-slot=kpi-title])]:tracking-tight",
);

export default function HomePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn(FLAT_SECTION, className)}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
