export interface DutyLegend {
  code: string;
  label: string;
  color: string;
}

export interface ScheduleEntry {
  id: string;
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
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
