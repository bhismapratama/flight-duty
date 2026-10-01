import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public, SuccessResponse } from '@common';

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return new SuccessResponse(HttpStatus.OK, 'OK', { status: 'up' });
  }
}
