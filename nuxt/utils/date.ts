export interface YearMonth {
  year: number;
  month: number;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

const pad = (value: number) => String(value).padStart(2, '0');

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function toUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function dayOfMonth(isoDate: string): number {
  return Number(isoDate.slice(8, 10));
}

export function yearMonthOf(isoDate: string): YearMonth {
  return { year: Number(isoDate.slice(0, 4)), month: Number(isoDate.slice(5, 7)) };
}

export function formatYearMonth({ year, month }: YearMonth): string {
  return `${year}-${pad(month)}`;
}

export function parseYearMonth(value: unknown): YearMonth | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = YEAR_MONTH_PATTERN.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year, month } : null;
}

export function addMonths({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function daysInMonth({ year, month }: YearMonth): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function mondayFirstWeekday(isoDate: string): number {
  return (toUtcDate(isoDate).getUTCDay() + 6) % 7;
}
