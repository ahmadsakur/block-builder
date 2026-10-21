"use client";

import {
  BlockReady,
  BlockStateProvider,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import { formatShare } from "@/components/dashboardblocks/breakdown";
import {
  DataTable,
  DataTableBar,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableStateRows,
} from "@/components/dashboardblocks/table";
import { formatCurrency, formatNumber } from "@/lib/dashboardblocks/format";
import type { ProductRevenue } from "../../../types/home.types";

const TITLE = "Revenue by product";

type ProductRevenueTableProps = {
  rows: ProductRevenue[];
  status?: BlockStatus;
};

export default function ProductRevenueTable({
  rows,
  status,
}: ProductRevenueTableProps) {
  const sorted = [...rows].sort((a, b) => b.revenue - a.revenue);
  const total = rows.reduce((sum, row) => sum + row.revenue, 0);
  const top = sorted[0];
  const description = top
    ? `${formatCurrency(total)} from ${rows.length} products; ${top.name} brings in ${formatShare(top.revenue, total)}.`
    : "No sales.";

  return (
    <BlockStateProvider state={getBlockState(status, rows)}>
      <section className="@container/data-table flex flex-col gap-3">
        <header className="flex flex-col gap-0.5">
          <h2 className="font-semibold tracking-tight">{TITLE}</h2>
          <BlockReady className="text-sm">
            <p className="text-muted-foreground text-sm">{description}</p>
          </BlockReady>
        </header>
        <DataTable caption={`${TITLE}: ${description}`}>
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead>Product</DataTableHead>
              <DataTableHead align="end">Units</DataTableHead>
              <DataTableHead className="w-2/5">Revenue</DataTableHead>
              <DataTableHead align="end">Share</DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            <DataTableStateRows colSpan={4} rows={6} />
            {!status &&
              sorted.map((row) => (
                <DataTableRow key={row.name}>
                  <DataTableCell primary>
                    <span className="block">{row.name}</span>
                    <span className="text-muted-foreground block text-xs font-normal">
                      {row.category}
                    </span>
                  </DataTableCell>
                  <DataTableCell align="end">
                    {formatNumber(row.units)}
                  </DataTableCell>
                  <DataTableCell>
                    <span className="flex w-full items-center gap-3">
                      <DataTableBar
                        max={top?.revenue ?? 0}
                        value={row.revenue}
                      />
                      <span className="w-16 shrink-0 text-right tabular-nums">
                        {formatCurrency(row.revenue)}
                      </span>
                    </span>
                  </DataTableCell>
                  <DataTableCell align="end" className="text-muted-foreground">
                    {formatShare(row.revenue, total)}
                  </DataTableCell>
                </DataTableRow>
              ))}
          </DataTableBody>
        </DataTable>
      </section>
    </BlockStateProvider>
  );
}
