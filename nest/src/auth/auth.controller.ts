import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import {
  ApiFailures,
  ApiSuccess,
  Public,
  SuccessResponse,
  THROTTLE_LOGIN_LIMIT,
  THROTTLE_MESSAGE,
  THROTTLE_TTL_MS,
} from '@common';

import { LOGIN_EXAMPLE } from './auth.examples.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/index.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: THROTTLE_LOGIN_LIMIT, ttl: THROTTLE_TTL_MS } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiSuccess('Login successful', LOGIN_EXAMPLE)
  @ApiFailures(
    '/auth/login',
    [400, 'username is required'],
    [401, 'Invalid username or password'],
    [429, THROTTLE_MESSAGE],
  )
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    return new SuccessResponse(HttpStatus.OK, 'Login successful', result);
  }
}
