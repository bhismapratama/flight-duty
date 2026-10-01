const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 86_400_000;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function toEpochDay(date: string): number {
  return Date.parse(`${date}T00:00:00Z`) / DAY_IN_MS;
}

export function fromEpochDay(epochDay: number): string {
  return new Date(epochDay * DAY_IN_MS).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return fromEpochDay(toEpochDay(date) + days);
}

export function diffInDays(from: string, to: string): number {
  return toEpochDay(to) - toEpochDay(from);
}

export function eachDay(from: string, to: string): string[] {
  const days: string[] = [];

  for (let day = toEpochDay(from); day <= toEpochDay(to); day++) {
    days.push(fromEpochDay(day));
  }

  return days;
}

export function toYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}
