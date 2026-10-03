import { registerAs } from '@nestjs/config';

export const THROTTLE_TTL_MS = 60_000;
export const THROTTLE_DEFAULT_LIMIT = 120;
export const THROTTLE_LOGIN_LIMIT = 10;
export const THROTTLE_MESSAGE = 'Too many requests, please try again later';

export const throttleConfig = registerAs('throttle', () => ({
  trustCfConnectingIp: process.env.TRUST_CF_CONNECTING_IP === 'true',
}));
