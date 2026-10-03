import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiFailures, ApiSuccess, CurrentUser, SuccessResponse } from '@common';

import { PILOT_PROFILE_EXAMPLE } from './pilot.examples.js';
import { PilotService } from './pilot.service.js';

@ApiTags('pilot')
@ApiBearerAuth()
@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get('me')
  @ApiSuccess('Pilot profile retrieved', PILOT_PROFILE_EXAMPLE)
  @ApiFailures('/pilot/me', [401, 'Missing access token'])
  getMe(@CurrentUser('sub') pilotId: string) {
    const profile = this.pilotService.getProfile(pilotId);

    return new SuccessResponse(HttpStatus.OK, 'Pilot profile retrieved', profile);
  }
}
