import { type YearMonth, daysInMonth, mondayFirstWeekday, toIsoDate } from './date';

export interface CalendarCell {
  key: string;
  date: string | null;
  day: number | null;
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function buildMonthGrid(value: YearMonth): CalendarCell[] {
  const total = daysInMonth(value);
  const leading = mondayFirstWeekday(toIsoDate(value.year, value.month, 1));
  const cells: CalendarCell[] = [];

  for (let index = 0; index < leading; index++) {
    cells.push({ key: `lead-${index}`, date: null, day: null });
  }

  for (let day = 1; day <= total; day++) {
    const date = toIsoDate(value.year, value.month, day);
    cells.push({ key: date, date, day });
  }

  const trailing = (7 - (cells.length % 7)) % 7;
  for (let index = 0; index < trailing; index++) {
    cells.push({ key: `trail-${index}`, date: null, day: null });
  }

  return cells;
}
