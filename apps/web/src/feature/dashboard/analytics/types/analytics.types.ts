import type { StatMetric } from "@/components/dashboardblocks/stat-group";

export type {
  AnalyticsPoint,
  AnalyticsSummary,
} from "@block-builder/shared/analytics";

export interface SparklineMetric extends StatMetric {
  history: number[];
}

export type VisitorDay = {
  label: string;
  visitors: number;
  conversions: number;
};
