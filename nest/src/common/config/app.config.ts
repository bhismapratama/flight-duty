import { registerAs } from '@nestjs/config';

import { isIsoDate } from '@utils';

export const DEFAULT_TODAY = '2026-05-15';
export const DEFAULT_PORT = 4000;
export const DEFAULT_HOST = '0.0.0.0';

export const appConfig = registerAs('app', () => {
  const port = Number(process.env.PORT ?? DEFAULT_PORT);

  return {
    port,
    host: process.env.HOST ?? DEFAULT_HOST,
    baseUrl: (process.env.BASE_URL ?? `http://localhost:${port}`).replace(/\/$/, ''),
    today: process.env.APP_TODAY ?? DEFAULT_TODAY,
    corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  };
});

function parseOrigins(value: string | undefined): true | string[] {
  if (!value || value.trim() === '*') {
    return true;
  }

  return value
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

export function assertValidToday(value: string | undefined): void {
  if (value !== undefined && !isIsoDate(value)) {
    throw new Error(`APP_TODAY must be a valid YYYY-MM-DD date, got ${JSON.stringify(value)}`);
  }
}
