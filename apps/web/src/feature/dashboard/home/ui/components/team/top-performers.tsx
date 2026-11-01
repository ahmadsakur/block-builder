import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import { KPIChange } from "@/components/dashboardblocks/kpi";
import {
  Leaderboard,
  LeaderboardItem,
  LeaderboardLabel,
  LeaderboardRank,
  LeaderboardValue,
} from "@/components/dashboardblocks/leaderboard";
import { PersonAvatar } from "@/components/dashboardblocks/team";
import {
  formatCurrency,
  formatPercent,
  joinDetails,
} from "@/lib/dashboardblocks/format";
import { cn } from "@/lib/utils";
import { summarizeReps } from "../../../logic/crm.logic";
import type { SalesRep } from "../../../types/crm.types";

const ROWS = 4;

const format = (value: number) => formatCurrency(value);

type TopPerformersProps = {
  reps: SalesRep[];
  status?: BlockStatus;
};

export default function TopPerformers({ reps, status }: TopPerformersProps) {
  const state = getBlockState(status, reps);
  const scale = Math.max(
    ...reps.map((rep) => rep.revenue / (rep.quota || 1)),
    1,
  );

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <h2 className="font-semibold tracking-tight">Top performers</h2>
          <BlockReady className="text-sm">
            <p className="text-muted-foreground text-sm">
              {summarizeReps(reps, format)}
            </p>
          </BlockReady>
        </header>
        <BlockStateRows className="border-t" rows={ROWS} />
        {!state && (
          <Leaderboard className="gap-0 border-t">
            {reps.map((rep, index) => {
              const attainment = rep.revenue / (rep.quota || 1);
              return (
                <LeaderboardItem
                  key={rep.id}
                  size="lg"
                  className="items-start border-b px-0 py-3 last:border-b-0"
                >
                  <LeaderboardRank rank={index + 1} className="mt-2.5" />
                  <PersonAvatar
                    className="size-9"
                    person={{ avatar: rep.avatar, name: rep.name }}
                  />
                  <LeaderboardLabel className="flex flex-col gap-1.5">
                    <div>
                      <p className="truncate font-medium">{rep.name}</p>
                      <p className="text-muted-foreground text-xs tabular-nums">
                        {joinDetails(
                          `${rep.deals} deals`,
                          `${formatPercent(attainment, { maximumFractionDigits: 0 })} of quota`,
                        )}
                      </p>
                    </div>
                    <div
                      aria-hidden
                      className="bg-muted relative h-1 rounded-full"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          attainment >= 1
                            ? "bg-chart-2"
                            : "bg-[color-mix(in_oklab,var(--color-chart-2)_30%,transparent)]",
                        )}
                        style={{ width: `${(attainment / scale) * 100}%` }}
                      />
                      <div
                        className="bg-foreground absolute -top-1 -bottom-1 w-px"
                        style={{ insetInlineStart: `${(1 / scale) * 100}%` }}
                      />
                    </div>
                  </LeaderboardLabel>
                  <LeaderboardValue className="flex flex-col items-end gap-0.5">
                    <span>{format(rep.revenue)}</span>
                    <KPIChange
                      className="text-xs font-normal"
                      comparison="last month"
                      format={format}
                      inline
                      previous={rep.revenue / (1 + rep.trend / 100)}
                      value={rep.revenue}
                      variant="short"
                    />
                  </LeaderboardValue>
                </LeaderboardItem>
              );
            })}
          </Leaderboard>
        )}
        {state !== "empty" && state !== "error" && (
          <p
            aria-hidden
            className="text-muted-foreground flex items-center gap-2 text-xs"
          >
            <span className="bg-foreground h-3 w-px" />
            The line on each bar is the rep&apos;s quota.
          </p>
        )}
      </section>
    </BlockStateProvider>
  );
}
