import { assertValidToday } from './app.config.js';
import { MIN_JWT_SECRET_LENGTH } from './jwt.config.js';

export function validateEnv(env: Record<string, unknown>): Record<string, unknown> {
  const secret = env.JWT_SECRET;

  if (typeof secret !== 'string' || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET is required and must be at least ${MIN_JWT_SECRET_LENGTH} characters`,
    );
  }

  assertValidToday(env.APP_TODAY as string | undefined);

  if (env.PORT !== undefined && !Number.isInteger(Number(env.PORT))) {
    throw new Error(`PORT must be an integer, got ${JSON.stringify(env.PORT)}`);
  }

  return env;
}
