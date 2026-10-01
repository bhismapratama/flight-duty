import { createHash, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { type JwtPayload, PILOT_ACCOUNT, jwtConfig } from '@common';

import type { LoginDto } from './dto/index.js';
import type { LoginResult } from './interface/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async login({ username, password }: LoginDto): Promise<LoginResult> {
    const usernameMatches = safeEqual(username, PILOT_ACCOUNT.username);
    const passwordMatches = safeEqual(password, PILOT_ACCOUNT.password);

    if (!usernameMatches || !passwordMatches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: JwtPayload = {
      sub: PILOT_ACCOUNT.id,
      username: PILOT_ACCOUNT.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: this.jwt.expiresIn,
    };
  }
}

function safeEqual(input: string, expected: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();

  return timingSafeEqual(digest(input), digest(expected));
}
