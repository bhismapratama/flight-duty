import { NotFoundException } from '@nestjs/common';

import { PILOT_ACCOUNT } from '@common';
import { DataService } from '@infra';

import { PilotService } from './pilot.service.js';

const appConfigFor = (today: string) => ({
  port: 4000,
  host: '0.0.0.0',
  baseUrl: 'http://localhost:4000',
  today,
  corsOrigins: true as const,
});

describe('PilotService', () => {
  const data = new DataService();

  it('counts total flight hours up to today, not the planned days after it', () => {
    const profile = new PilotService(data, appConfigFor('2026-05-15')).getProfile(PILOT_ACCOUNT.id);

    expect(profile.totalFlightHours).toBe(1385.4);
    expect(data.flightHours.pilot.totalFlightHours).toBe(1444.5);
  });

  it('matches the seed total once today is past the last day of data', () => {
    const profile = new PilotService(data, appConfigFor('2026-06-30')).getProfile(PILOT_ACCOUNT.id);

    expect(profile.totalFlightHours).toBe(1444.5);
  });

  it('returns 0 when today is before the first day of data', () => {
    const profile = new PilotService(data, appConfigFor('2024-12-01')).getProfile(PILOT_ACCOUNT.id);

    expect(profile.totalFlightHours).toBe(0);
  });

  it('rejects an unknown pilot', () => {
    expect(() => new PilotService(data, appConfigFor('2026-05-15')).getProfile('pilot-999')).toThrow(
      NotFoundException,
    );
  });
});
