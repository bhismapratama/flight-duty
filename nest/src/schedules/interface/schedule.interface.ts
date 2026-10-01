import type { DutyLegend, ScheduleSeedEntry } from '@infra';

export interface ScheduleEntry extends ScheduleSeedEntry {
  remaining: number;
  is_complete: boolean;
}

export interface MonthSchedule {
  year: number;
  month: number;
  today: string;
  legend: DutyLegend[];
  items: ScheduleEntry[];
}
