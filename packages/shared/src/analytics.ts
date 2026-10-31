export interface AnalyticsPoint {
  date: string;
  visitors: number;
  conversions: number;
}

export interface AnalyticsSummary {
  visitors: number;
  conversions: number;
  conversionRate: number;
  series: AnalyticsPoint[];
}
