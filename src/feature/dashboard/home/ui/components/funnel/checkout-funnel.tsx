"use client";

import { Fragment } from "react";
import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  FunnelBar,
  type FunnelStage,
  formatRate,
  getFunnelSteps,
} from "@/components/dashboardblocks/funnel";
import { KPIValue } from "@/components/dashboardblocks/kpi";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableRowHead,
} from "@/components/dashboardblocks/table";
import { formatNumber } from "@/lib/dashboardblocks/format";

const TITLE = "Checkout funnel";
const DESCRIPTION =
  "Most shoppers who leave do it between viewing a product and adding it to the cart.";

type CheckoutFunnelProps = {
  stages: FunnelStage[];
  status?: BlockStatus;
};

export default function CheckoutFunnel({
  stages,
  status,
}: CheckoutFunnelProps) {
  const state = getBlockState(status, stages);
  const steps = getFunnelSteps(stages);
  const first = steps[0];
  const last = steps.at(-1);

  return (
    <BlockStateProvider state={state}>
      <section className="@container flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">{TITLE}</h2>
          <p className="text-muted-foreground text-sm">{DESCRIPTION}</p>
        </header>
        <dl className="flex flex-col gap-1 border-t pt-4">
          <dt className="text-muted-foreground text-sm">Overall conversion</dt>
          <dd>
            <KPIValue
              value={last?.fromStart}
              format={(value) => formatRate(value, 2)}
            />
          </dd>
          <BlockReady className="text-xs">
            {first && last && (
              <dd className="text-muted-foreground text-xs tabular-nums">
                {formatNumber(last.value)} of {formatNumber(first.value)}
              </dd>
            )}
          </BlockReady>
        </dl>
        {state === "loading" && <BlockStateRows rows={5} />}
        {!state && (
          <DataTable density="compact" caption={`${TITLE}: ${DESCRIPTION}`}>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead>Stage</DataTableHead>
                <DataTableHead align="end">Users</DataTableHead>
                <DataTableHead align="end">
                  Conversion<span className="sr-only"> from previous step</span>
                </DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {steps.map((step, index) => (
                <Fragment key={step.label}>
                  <DataTableRow className="border-b-0">
                    <DataTableRowHead className="pb-1.5">
                      {step.label}
                    </DataTableRowHead>
                    <DataTableCell
                      align="end"
                      className="w-20 pb-1.5 font-medium"
                    >
                      {formatNumber(step.value)}
                    </DataTableCell>
                    <DataTableCell
                      align="end"
                      className="text-muted-foreground w-24 pb-1.5"
                    >
                      {index === 0 ? "—" : formatRate(step.fromPrevious)}
                    </DataTableCell>
                  </DataTableRow>
                  <DataTableRow aria-hidden>
                    <DataTableCell colSpan={3} className="pt-0">
                      <FunnelBar
                        delay={index * 80}
                        value={step.fromStart * 100}
                      />
                    </DataTableCell>
                  </DataTableRow>
                </Fragment>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </section>
    </BlockStateProvider>
  );
}
