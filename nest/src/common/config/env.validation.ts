import { assertValidToday } from './app.config.js';
import { MIN_JWT_SECRET_LENGTH, isValidJwtExpiresIn } from './jwt.config.js';

export function validateEnv(env: Record<string, unknown>): Record<string, unknown> {
  const secret = env.JWT_SECRET;

  if (typeof secret !== 'string' || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET is required and must be at least ${MIN_JWT_SECRET_LENGTH} characters`,
    );
  }

  const expiresIn = env.JWT_EXPIRES_IN;

  if (expiresIn !== undefined && (typeof expiresIn !== 'string' || !isValidJwtExpiresIn(expiresIn))) {
    throw new Error(
      `JWT_EXPIRES_IN must be a number followed by s, m, h or d (for example 12h), got ${JSON.stringify(expiresIn)}`,
    );
  }

  assertValidToday(env.APP_TODAY as string | undefined);

  if (env.PORT !== undefined && !Number.isInteger(Number(env.PORT))) {
    throw new Error(`PORT must be an integer, got ${JSON.stringify(env.PORT)}`);
  }

  return env;
}
