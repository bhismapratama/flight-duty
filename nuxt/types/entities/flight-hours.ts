export type SummaryRange = '1w' | '1m' | '3m' | '6m' | '1y';

export type LimitKey = 'daily' | 'weekly' | 'monthly' | 'annual';

export type LimitStatus = 'safe' | 'warning' | 'exceeded';

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
