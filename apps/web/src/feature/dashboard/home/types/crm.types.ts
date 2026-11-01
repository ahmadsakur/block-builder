import type { KPIFormat } from "@/components/dashboardblocks/kpi";

export interface MetricPoint {
  label: string;
  value: number;
}

export type MetricVisual =
  | { kind: "trend"; points: MetricPoint[] }
  | { kind: "count"; done: number; goal: number; unit: string }
  | { kind: "goal"; goal: number }
  | { kind: "daily"; points: MetricPoint[]; unit: string };

export interface DealMetric {
  comparison: string;
  format?: KPIFormat;
  key: string;
  previous: number;
  title: string;
  value: number;
  visual: MetricVisual;
}

export interface PipelineStage {
  deals: number;
  key: string;
  label: string;
  value: number;
}

export interface QuotaProgress {
  comparison: string;
  daysElapsed: number;
  daysInPeriod: number;
  previous: number;
  target: number;
  title: string;
  value: number;
}

export interface QuotaPace {
  expected: number;
  gap: number;
  projected: number;
  projectedShare: number;
  share: number;
}

export interface SalesRep {
  avatar?: string;
  deals: number;
  id: string;
  name: string;
  quota: number;
  revenue: number;
  trend: number;
}

export interface FollowUp {
  done?: boolean;
  due: Date;
  id: string;
  owner?: string;
  title: string;
}

export interface FollowUpGroup {
  name: string;
  tasks: FollowUp[];
}

export interface CrmOverview {
  followUps: FollowUpGroup[];
  metrics: DealMetric[];
  now: Date;
  quota: QuotaProgress;
  reps: SalesRep[];
  stages: PipelineStage[];
  wonThisWeek: number;
}
