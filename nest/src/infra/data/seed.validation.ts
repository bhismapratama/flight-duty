import { isIsoDate } from '@utils';

import {
  type DocumentsSeed,
  type FlightHoursSeed,
  LIMIT_KEYS,
  SUMMARY_RANGES,
  type SchedulesSeed,
} from './interface/index.js';

const CHART_BOUND_FIELDS = ['limit', 'max', 'windowDays', 'displayRangeDays'] as const;

export function assertFlightHoursSeed(seed: FlightHoursSeed): void {
  const fail: (reason: string) => never = failFor('flight-hours.json');

  for (const key of LIMIT_KEYS) {
    if (!isPositive(seed.limits?.[key])) {
      fail(`limits.${key} must be a positive number`);
    }
  }

  for (const range of SUMMARY_RANGES) {
    const bound = seed.chartBounds?.[range];

    if (!bound) {
      fail(`chartBounds.${range} is missing`);
    }

    for (const field of CHART_BOUND_FIELDS) {
      if (!isPositive(bound[field])) {
        fail(`chartBounds.${range}.${field} must be a positive number`);
      }
    }
  }

  if (!Array.isArray(seed.flightHours) || seed.flightHours.length === 0) {
    fail('flightHours must be a non-empty list');
  }

  for (const entry of seed.flightHours) {
    if (!isIsoDate(entry.date)) {
      fail(`invalid date ${JSON.stringify(entry.date)}`);
    }

    if (typeof entry.hours !== 'number' || !Number.isFinite(entry.hours) || entry.hours < 0) {
      fail(`hours on ${entry.date} must be zero or more`);
    }
  }
}

export function assertDocumentsSeed(seed: DocumentsSeed): void {
  const fail: (reason: string) => never = failFor('documents.json');

  if (!Number.isInteger(seed.thresholds?.warningDays) || seed.thresholds.warningDays < 0) {
    fail('thresholds.warningDays must be a whole number of days');
  }

  for (const document of seed.documents ?? []) {
    if (!isIsoDate(document.expiryDate)) {
      fail(`invalid expiryDate ${JSON.stringify(document.expiryDate)} on ${document.id}`);
    }
  }
}

export function assertSchedulesSeed(seed: SchedulesSeed): void {
  const fail: (reason: string) => never = failFor('schedules.json');

  if (!Array.isArray(seed.legend) || seed.legend.length === 0) {
    fail('legend must be a non-empty list');
  }

  for (const entry of seed.schedules ?? []) {
    if (!isIsoDate(entry.duty_date)) {
      fail(`invalid duty_date ${JSON.stringify(entry.duty_date)} on ${entry.id}`);
    }

    if (!isCount(entry.count_schedules) || !isCount(entry.count_logbooks)) {
      fail(`counts on ${entry.duty_date} must be whole numbers of zero or more`);
    }
  }
}

function failFor(fileName: string): (reason: string) => never {
  return reason => {
    throw new Error(`Seed file ${fileName}: ${reason}`);
  };
}

function isPositive(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isCount(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 0;
}
