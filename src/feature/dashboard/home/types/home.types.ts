import type { BreakdownSegment } from "@/components/dashboardblocks/breakdown";
import type { DateRangePreset } from "@/components/dashboardblocks/dashboard-header";
import type { FunnelStage } from "@/components/dashboardblocks/funnel";
import type { StatMetric } from "@/components/dashboardblocks/stat-group";

export interface StoreQuery {
  compare: boolean;
  preset: DateRangePreset;
  region: string | null;
}

export interface Region {
  name: string;
  phase: number;
  share: number;
}

export interface Channel {
  color: string;
  label: string;
  share: number;
}

export interface Product {
  category: string;
  name: string;
  price: number;
  share: number;
}

export interface ProductRevenue {
  category: string;
  name: string;
  revenue: number;
  units: number;
}

export interface StockItem {
  dailyDemand: number;
  leadTimeDays: number;
  name: string;
  onHand: number;
  onOrder?: number;
  reorderPoint: number;
  sku: string;
}

export interface SparklineMetric extends StatMetric {
  history: number[];
}

export interface RevenuePoint {
  current: number;
  label: string;
  previous: number;
}

export interface MonthToDate {
  current: number;
  elapsed: number;
  name: string;
  target: number;
  total: number;
}

export interface StoreData {
  bestDay: string;
  channels: BreakdownSegment[];
  channelSummary: string;
  chart: RevenuePoint[];
  funnel: FunnelStage[];
  month: MonthToDate;
  previousLabel: string;
  products: ProductRevenue[];
  rangeLabel: string;
  stats: SparklineMetric[];
}
