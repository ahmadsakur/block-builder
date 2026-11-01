"use client";

import { FolderKanbanIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/_ui/button";
import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  formatUsage,
  UsageBar,
  UsageStatusLabel,
} from "@/components/dashboardblocks/usage-meter";
import type { LimitKey } from "@/feature/dashboard/_shared/types/entitlements.types";
import { UPGRADE_PATH } from "@/lib/auth/routes";
import { atLimit, nearLimit, planSummary } from "../../../logic/plan.logic";
import type { PlanLimit } from "../../../types/plan.types";

const LIMIT_ICONS: Record<LimitKey, ReactNode> = {
  "projects.max": <FolderKanbanIcon />,
};

type PlanUsageProps = {
  plan?: string;
  limits: PlanLimit[];
  status?: BlockStatus;
};

function LimitRow({ item }: { item: PlanLimit }) {
  const full = atLimit(item);
  const near = nearLimit(item);

  return (
    <li className="flex flex-col gap-2 border-b py-2.5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground flex min-w-0 items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
          {LIMIT_ICONS[item.key]}
          <span className="text-foreground truncate">{item.name}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-3 text-xs">
          {(full || near) && (
            <UsageStatusLabel
              className="text-xs"
              status={full ? "critical" : "warning"}
              label={full ? "Limit reached" : "Nearing limit"}
            />
          )}
          <span className="text-muted-foreground tabular-nums">
            <span className="text-foreground font-medium">
              {formatUsage(item.used)}
            </span>{" "}
            of{" "}
            {item.limit === null
              ? "unlimited"
              : formatUsage(item.limit, item.unit, { compact: true })}
          </span>
        </span>
      </div>
      {item.limit !== null && (
        <UsageBar limit={item.limit} size="sm" used={item.used} />
      )}
    </li>
  );
}

export default function PlanUsage({ plan, limits, status }: PlanUsageProps) {
  const state = getBlockState(status, limits);
  const full = limits.some(atLimit);

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-semibold tracking-tight">
              {plan ? `${plan} plan` : "Your plan"}
            </h2>
            <BlockReady className="text-sm">
              <p className="text-muted-foreground text-sm">
                {planSummary(limits)}
              </p>
            </BlockReady>
          </div>
          <Link
            href={UPGRADE_PATH}
            className={buttonVariants({
              className: "shrink-0",
              size: "sm",
              variant: full ? "default" : "outline",
            })}
          >
            See plans
          </Link>
        </header>
        {state && <BlockStateRows className="border-t" rows={1} />}
        {!state && (
          <ul className="flex flex-col border-t">
            {limits.map((item) => (
              <LimitRow key={item.key} item={item} />
            ))}
          </ul>
        )}
      </section>
    </BlockStateProvider>
  );
}
