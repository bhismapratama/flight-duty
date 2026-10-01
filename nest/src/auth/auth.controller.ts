import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public, SuccessResponse, THROTTLE_LOGIN_LIMIT, THROTTLE_TTL_MS } from '@common';

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
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    return new SuccessResponse(HttpStatus.OK, 'Login successful', result);
  }
}
