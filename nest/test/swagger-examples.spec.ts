import { PILOT_ACCOUNT } from '@common';
import { DataService } from '@infra';

import { DOCUMENTS_EXAMPLE } from '../src/documents/documents.examples.js';
import { DocumentsService } from '../src/documents/documents.service.js';
import { FLIGHT_HOURS_EXAMPLE, FLIGHT_HOURS_SUMMARY_EXAMPLE } from '../src/flight-hours/flight-hours.examples.js';
import { FlightHoursService } from '../src/flight-hours/flight-hours.service.js';
import { PILOT_PROFILE_EXAMPLE } from '../src/pilot/pilot.examples.js';
import { PilotService } from '../src/pilot/pilot.service.js';
import { SCHEDULES_EXAMPLE } from '../src/schedules/schedules.examples.js';
import { SchedulesService } from '../src/schedules/schedules.service.js';

const app = {
  port: 4000,
  host: '0.0.0.0',
  baseUrl: 'http://localhost:4000',
  today: '2026-05-15',
  corsOrigins: true as const,
};

describe('Swagger examples match the real responses', () => {
  const data = new DataService();

  it('pilot profile', () => {
    expect(new PilotService(data, app).getProfile(PILOT_ACCOUNT.id)).toEqual(PILOT_PROFILE_EXAMPLE);
  });

  it('flight hours', () => {
    const service = new FlightHoursService(data, app);

    expect(service.getDailyHours('2026-05-14', '2026-05-15')).toEqual(FLIGHT_HOURS_EXAMPLE);

    const summary = service.getSummary('1w');
    const { cards, chart, ...rest } = FLIGHT_HOURS_SUMMARY_EXAMPLE;

    expect(summary).toMatchObject(rest);
    expect(summary.cards).toEqual(expect.arrayContaining(cards));
    expect(summary.chart.points).toEqual(expect.arrayContaining(chart.points));
  });

  it('documents', () => {
    const result = new DocumentsService(data, app).getDocuments();

    expect(result.items).toEqual(expect.arrayContaining(DOCUMENTS_EXAMPLE.items));
    expect(result.warningDays).toBe(DOCUMENTS_EXAMPLE.warningDays);
  });

  it('schedules', () => {
    const result = new SchedulesService(data, app).getMonth(2026, 5);

    expect(result.items).toEqual(expect.arrayContaining(SCHEDULES_EXAMPLE.items));
    expect(result.legend).toEqual(expect.arrayContaining(SCHEDULES_EXAMPLE.legend));
  });
});
