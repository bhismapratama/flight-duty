import { validateEnv } from './env.validation.js';

const SECRET = 'a-secret-that-is-at-least-32-characters-long';

describe('validateEnv', () => {
  it('accepts a minimal valid environment', () => {
    expect(validateEnv({ JWT_SECRET: SECRET })).toEqual({ JWT_SECRET: SECRET });
  });

  it('rejects a short JWT secret', () => {
    expect(() => validateEnv({ JWT_SECRET: 'short' })).toThrow('JWT_SECRET');
  });

  it.each(['12h', '30m', '3600s', '7d'])('accepts JWT_EXPIRES_IN=%s', expiresIn => {
    expect(() => validateEnv({ JWT_SECRET: SECRET, JWT_EXPIRES_IN: expiresIn })).not.toThrow();
  });

  it.each(['abc', '3600', '12 h', '0h', '1w', ''])('rejects JWT_EXPIRES_IN=%j', expiresIn => {
    expect(() => validateEnv({ JWT_SECRET: SECRET, JWT_EXPIRES_IN: expiresIn })).toThrow(
      'JWT_EXPIRES_IN',
    );
  });

  it('rejects an impossible APP_TODAY', () => {
    expect(() => validateEnv({ JWT_SECRET: SECRET, APP_TODAY: '2026-02-30' })).toThrow('APP_TODAY');
  });
});
