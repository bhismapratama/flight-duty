import type { Request } from 'express';

import { resolveClientIp } from './client-ip-throttler.guard.js';

const requestFrom = (ip: string | undefined, cfConnectingIp?: string) =>
  ({
    ip,
    headers: cfConnectingIp ? { 'cf-connecting-ip': cfConnectingIp } : {},
  }) as Pick<Request, 'headers' | 'ip'>;

describe('resolveClientIp', () => {
  it('ignores CF-Connecting-IP unless the app runs behind Cloudflare', () => {
    expect(resolveClientIp(requestFrom('10.0.0.5', '203.0.113.7'), false)).toBe('10.0.0.5');
  });

  it('uses CF-Connecting-IP behind Cloudflare', () => {
    expect(resolveClientIp(requestFrom('10.0.0.5', '203.0.113.7'), true)).toBe('203.0.113.7');
  });

  it('falls back to the socket address when the header is missing', () => {
    expect(resolveClientIp(requestFrom('10.0.0.5'), true)).toBe('10.0.0.5');
  });

  it('never returns an empty tracker', () => {
    expect(resolveClientIp(requestFrom(undefined), false)).toBe('unknown');
  });
});
