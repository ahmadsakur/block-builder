"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from "nuqs";
import { DATE_RANGE_PRESETS } from "@/components/dashboardblocks/dashboard-header";
import { DEFAULT_QUERY, REGIONS } from "../data/home.data";
import { getLowStock, getStoreOverview } from "../service/home.service";
import type { StoreQuery } from "../types/home.types";

const storeQueryParams = {
  compare: parseAsBoolean.withDefault(DEFAULT_QUERY.compare),
  preset: parseAsStringLiteral(
    DATE_RANGE_PRESETS.map((preset) => preset.value),
  ).withDefault(DEFAULT_QUERY.preset),
  region: parseAsStringLiteral(REGIONS.map((region) => region.name)),
};

export function useStoreQueryParams() {
  return useQueryStates(storeQueryParams, { history: "replace" });
}

export const homeKeys = {
  all: ["home"] as const,
  overview: (query: StoreQuery) =>
    [...homeKeys.all, "overview", query] as const,
  lowStock: () => [...homeKeys.all, "low-stock"] as const,
};

export function useStoreOverviewQuery(query: StoreQuery) {
  return useQuery({
    queryKey: homeKeys.overview(query),
    queryFn: () => getStoreOverview(query),
    placeholderData: keepPreviousData,
  });
}

export function useLowStockQuery() {
  return useQuery({
    queryKey: homeKeys.lowStock(),
    queryFn: getLowStock,
  });
}
