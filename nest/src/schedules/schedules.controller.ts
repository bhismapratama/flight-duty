import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from '@common';

import { GetSchedulesDto } from './dto/index.js';
import { SchedulesService } from './schedules.service.js';

@ApiTags('schedules')
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  getMonth(@Query() { year, month }: GetSchedulesDto) {
    const result = this.schedulesService.getMonth(year, month);

    return new SuccessResponse(HttpStatus.OK, 'Schedules retrieved', result);
  }
}
