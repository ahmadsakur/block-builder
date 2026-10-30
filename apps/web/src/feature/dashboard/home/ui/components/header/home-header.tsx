"use client";

import { MapPinIcon } from "lucide-react";
import {
  CompareToggle,
  DateRangePicker,
  ExportMenu,
  FilterChip,
  FilterMenu,
  getDateRange,
  getPreviousRange,
} from "@/components/dashboardblocks/dashboard-header";
import { formatDateRange } from "@/lib/dashboardblocks/format";
import { REGIONS } from "../../../data/home.data";
import type { StoreQuery } from "../../../types/home.types";

type HomeHeaderProps = {
  title: string;
  query: StoreQuery;
  today: Date;
  onChange: (patch: Partial<StoreQuery>) => void;
};

export default function HomeHeader({
  title,
  query,
  today,
  onChange,
}: HomeHeaderProps) {
  const range = getDateRange(query.preset, today);

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <CompareToggle
              checked={query.compare}
              onCheckedChange={(compare) => onChange({ compare })}
            />
            <ExportMenu onExport={() => {}} />
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Showing{" "}
          <DateRangePicker
            onValueChange={(preset) => onChange({ preset })}
            today={today}
            value={query.preset}
            variant="inline"
          />
          <span aria-live="polite">
            , {formatDateRange(range)}
            {query.compare &&
              `, compared with ${formatDateRange(getPreviousRange(range))}`}
            .
          </span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {query.region && (
          <FilterChip
            field="Region"
            value={query.region}
            onRemove={() => onChange({ region: null })}
          />
        )}
        <FilterMenu
          allLabel="All regions"
          label="Region"
          onValueChange={(region) => onChange({ region })}
          options={REGIONS.map((item) => item.name)}
          value={query.region}
        >
          <MapPinIcon />
          {query.region ? "Change region" : "Filter by region"}
        </FilterMenu>
      </div>
    </header>
  );
}
