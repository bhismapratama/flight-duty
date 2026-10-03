import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiFailures, ApiSuccess, SuccessResponse } from '@common';

import { GetFlightHoursDto, GetSummaryDto } from './dto/index.js';
import { FLIGHT_HOURS_EXAMPLE, FLIGHT_HOURS_SUMMARY_EXAMPLE } from './flight-hours.examples.js';
import { FlightHoursService } from './flight-hours.service.js';

@ApiTags('flight-hours')
@ApiBearerAuth()
@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  @ApiSuccess('Flight hours retrieved', FLIGHT_HOURS_EXAMPLE)
  @ApiFailures(
    '/flight-hours',
    [400, 'from must be a valid date in YYYY-MM-DD format'],
    [401, 'Missing access token'],
  )
  getDailyHours(@Query() { from, to }: GetFlightHoursDto) {
    const result = this.flightHoursService.getDailyHours(from, to);

    return new SuccessResponse(HttpStatus.OK, 'Flight hours retrieved', result);
  }

  @Get('summary')
  @ApiSuccess('Flight hours summary retrieved', FLIGHT_HOURS_SUMMARY_EXAMPLE)
  @ApiFailures(
    '/flight-hours/summary',
    [400, 'range must be one of: 1w, 1m, 3m, 6m, 1y'],
    [401, 'Missing access token'],
  )
  getSummary(@Query() { range }: GetSummaryDto) {
    const result = this.flightHoursService.getSummary(range);

    return new SuccessResponse(HttpStatus.OK, 'Flight hours summary retrieved', result);
  }
}
