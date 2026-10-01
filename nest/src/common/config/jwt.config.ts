import { registerAs } from '@nestjs/config';

export const MIN_JWT_SECRET_LENGTH = 32;

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '12h',
}));
