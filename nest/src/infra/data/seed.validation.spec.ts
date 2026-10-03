import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DocumentsSeed, FlightHoursSeed, SchedulesSeed } from './interface/index.js';
import { assertDocumentsSeed, assertFlightHoursSeed, assertSchedulesSeed } from './seed.validation.js';

const readSeed = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(import.meta.dirname, 'seed', fileName), 'utf8')) as T;

describe('seed validation', () => {
  const flightHours = readSeed<FlightHoursSeed>('flight-hours.json');
  const documents = readSeed<DocumentsSeed>('documents.json');
  const schedules = readSeed<SchedulesSeed>('schedules.json');

  it('accepts the provided seed files', () => {
    expect(() => assertFlightHoursSeed(flightHours)).not.toThrow();
    expect(() => assertDocumentsSeed(documents)).not.toThrow();
    expect(() => assertSchedulesSeed(schedules)).not.toThrow();
  });

  it('fails at boot when a chart range is missing', () => {
    const { '1y': _removed, ...chartBounds } = flightHours.chartBounds;

    expect(() =>
      assertFlightHoursSeed({ ...flightHours, chartBounds: chartBounds as FlightHoursSeed['chartBounds'] }),
    ).toThrow('Seed file flight-hours.json: chartBounds.1y is missing');
  });

  it('rejects a non-positive limit', () => {
    expect(() =>
      assertFlightHoursSeed({ ...flightHours, limits: { ...flightHours.limits, weekly: 0 } }),
    ).toThrow('limits.weekly must be a positive number');
  });

  it('rejects negative hours and impossible dates', () => {
    expect(() =>
      assertFlightHoursSeed({ ...flightHours, flightHours: [{ date: '2026-05-15', hours: -1 }] }),
    ).toThrow('hours on 2026-05-15');
    expect(() =>
      assertFlightHoursSeed({ ...flightHours, flightHours: [{ date: '2026-02-30', hours: 1 }] }),
    ).toThrow('invalid date');
  });

  it('rejects broken document and schedule entries', () => {
    expect(() =>
      assertDocumentsSeed({ ...documents, thresholds: { warningDays: -1 } }),
    ).toThrow('warningDays');
    expect(() =>
      assertSchedulesSeed({
        ...schedules,
        schedules: [{ ...schedules.schedules[0]!, count_logbooks: -1 }],
      }),
    ).toThrow('counts on');
  });
});
