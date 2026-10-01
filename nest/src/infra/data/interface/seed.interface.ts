export type SummaryRange = '1w' | '1m' | '3m' | '6m' | '1y';

export interface ChartBound {
  limit: number;
  max: number;
  windowDays: number;
  displayRangeDays: number;
}

export interface FlightHoursSeed {
  pilot: {
    name: string;
    totalFlightHours: number;
  };
  limits: {
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
  };
  chartBounds: Record<SummaryRange, ChartBound>;
  flightHours: { date: string; hours: number }[];
}

export interface DocumentsSeed {
  today: string;
  thresholds: {
    warningDays: number;
  };
  documents: {
    id: string;
    label: string;
    expiryDate: string;
  }[];
}

export interface DutyLegend {
  code: string;
  label: string;
  color: string;
}

export interface ScheduleSeedEntry {
  id: string;
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
}

export interface SchedulesSeed {
  today: string;
  legend: DutyLegend[];
  schedules: ScheduleSeedEntry[];
}
