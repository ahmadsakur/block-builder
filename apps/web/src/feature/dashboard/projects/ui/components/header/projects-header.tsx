import { DownloadIcon, LockIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/_ui/button";
import { usageLabel } from "@/feature/dashboard/_shared/logic/entitlements.logic";
import type { LimitState } from "@/feature/dashboard/_shared/types/entitlements.types";
import { upgradeHref } from "@/lib/auth/routes";

type ProjectsHeaderProps = {
  usage?: LimitState;
  exportAllowed?: boolean;
  exporting: boolean;
  onExport: () => void;
  onCreate: () => void;
};

export default function ProjectsHeader({
  usage,
  exportAllowed,
  exporting,
  onExport,
  onCreate,
}: ProjectsHeaderProps) {
  const full = usage?.hasRoom === false;

  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          {usage
            ? `${usageLabel("projects.max", usage)}.`
            : "Everything you're working on."}
          {full && (
            <>
              {" "}
              <Link
                href={upgradeHref("projects.max")}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                Upgrade for more
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {exportAllowed === false ? (
          <Link
            href={upgradeHref("projects.export")}
            className={buttonVariants({ variant: "outline" })}
          >
            <LockIcon />
            Export CSV
          </Link>
        ) : (
          <Button
            variant="outline"
            disabled={exporting || exportAllowed === undefined}
            onClick={onExport}
          >
            <DownloadIcon />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        )}
        <Button disabled={full} onClick={onCreate}>
          {full ? <LockIcon /> : <PlusIcon />}
          New project
        </Button>
      </div>
    </header>
  );
}
