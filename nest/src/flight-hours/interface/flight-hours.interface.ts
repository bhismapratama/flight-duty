import type { LIMIT_KEYS, SummaryRange } from '@infra';

export { SUMMARY_RANGES } from '@infra';

export type LimitKey = (typeof LIMIT_KEYS)[number];

export type LimitStatus = 'safe' | 'warning' | 'exceeded';

export interface DailyHours {
  date: string;
  hours: number;
  isFuture: boolean;
}

export interface FlightHoursRange {
  from: string;
  to: string;
  today: string;
  totalHours: number;
  days: DailyHours[];
}

export interface LimitCard {
  key: LimitKey;
  label: string;
  windowDays: number;
  hours: number;
  limit: number;
  remaining: number;
  percentage: number;
  status: LimitStatus;
}

export interface ChartPoint {
  date: string;
  value: number;
  isToday: boolean;
  isFuture: boolean;
  isPartialWindow: boolean;
  isOverLimit: boolean;
}

export interface RollingChart {
  windowDays: number;
  limit: number;
  max: number;
  yAxisMax: number;
  points: ChartPoint[];
}

export interface FlightHoursSummary {
  today: string;
  range: SummaryRange;
  cards: LimitCard[];
  chart: RollingChart;
}
