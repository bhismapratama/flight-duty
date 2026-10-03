import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiFailures, ApiSuccess, SuccessResponse } from '@common';

import { GetSchedulesDto } from './dto/index.js';
import { SCHEDULES_EXAMPLE } from './schedules.examples.js';
import { SchedulesService } from './schedules.service.js';

@ApiTags('schedules')
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiSuccess('Schedules retrieved', SCHEDULES_EXAMPLE)
  @ApiFailures(
    '/schedules',
    [400, 'month must be between 1 and 12'],
    [401, 'Missing access token'],
  )
  getMonth(@Query() { year, month }: GetSchedulesDto) {
    const result = this.schedulesService.getMonth(year, month);

    return new SuccessResponse(HttpStatus.OK, 'Schedules retrieved', result);
  }
}
