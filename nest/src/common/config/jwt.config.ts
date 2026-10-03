import { registerAs } from '@nestjs/config';

export const MIN_JWT_SECRET_LENGTH = 32;
export const DEFAULT_JWT_EXPIRES_IN = '12h';

const JWT_EXPIRES_IN_PATTERN = /^[1-9]\d*[smhd]$/;

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
}));

export function isValidJwtExpiresIn(value: string): boolean {
  return JWT_EXPIRES_IN_PATTERN.test(value);
}
