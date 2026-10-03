import { type YearMonth, toUtcDate } from './date';

const LOCALE = 'en-GB';

const fullDate = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const longDate = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortDate = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const weekdayLabel = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  timeZone: 'UTC',
});

const monthLabel = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const hoursNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatDate(isoDate: string): string {
  return fullDate.format(toUtcDate(isoDate));
}

export function formatLongDate(isoDate: string): string {
  return longDate.format(toUtcDate(isoDate));
}

export function formatShortDate(isoDate: string): string {
  return shortDate.format(toUtcDate(isoDate));
}

export function formatWeekday(isoDate: string): string {
  return weekdayLabel.format(toUtcDate(isoDate));
}

export function formatMonth(value: YearMonth): string {
  return monthLabel.format(new Date(Date.UTC(value.year, value.month - 1, 1)));
}

export function formatHours(hours: number): string {
  return hoursNumber.format(hours);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${Math.abs(count) === 1 ? singular : plural}`;
}
