import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public, SuccessResponse } from '@common';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/index.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    return new SuccessResponse(HttpStatus.OK, 'Login successful', result);
  }
}
