import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from '@common';

import { GetFlightHoursDto, GetSummaryDto } from './dto/index.js';
import { FlightHoursService } from './flight-hours.service.js';

@ApiTags('flight-hours')
@ApiBearerAuth()
@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  getDailyHours(@Query() { from, to }: GetFlightHoursDto) {
    const result = this.flightHoursService.getDailyHours(from, to);

    return new SuccessResponse(HttpStatus.OK, 'Flight hours retrieved', result);
  }

  @Get('summary')
  getSummary(@Query() { range }: GetSummaryDto) {
    const result = this.flightHoursService.getSummary(range);

    return new SuccessResponse(HttpStatus.OK, 'Flight hours summary retrieved', result);
  }
}
