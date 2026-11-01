import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/_ui/button";
import { Skeleton } from "@/components/_ui/skeleton";
import { formatCurrency } from "@/lib/dashboardblocks/format";
import {
  describePipeline,
  describeWeek,
  greeting,
} from "../../../logic/crm.logic";
import type { PipelineStage } from "../../../types/crm.types";

const compact = (value: number) => formatCurrency(value, { compact: true });

type WelcomeHeroProps = {
  name?: string;
  now?: Date;
  stages?: PipelineStage[];
  wonThisWeek?: number;
};

export default function WelcomeHero({
  name,
  now,
  stages,
  wonThisWeek,
}: WelcomeHeroProps) {
  const ready = stages !== undefined && wonThisWeek !== undefined;

  return (
    <section
      aria-label="This week"
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          {now ? greeting(now, name) : "Welcome back"}
        </p>
        {ready ? (
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            {describeWeek(wonThisWeek)}
          </h1>
        ) : (
          <Skeleton className="h-9 w-72" />
        )}
        {ready ? (
          <p className="text-muted-foreground text-sm">
            {describePipeline(stages, compact)}
          </p>
        ) : (
          <Skeleton className="h-4 w-56" />
        )}
      </div>
      <Link
        href="/dashboard/projects"
        className={buttonVariants({ className: "shrink-0 rounded-full" })}
      >
        Open projects
        <ArrowUpRightIcon data-icon="inline-end" />
      </Link>
    </section>
  );
}
