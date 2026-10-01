import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, SuccessResponse } from '@common';

import { PilotService } from './pilot.service.js';

@ApiTags('pilot')
@ApiBearerAuth()
@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get('me')
  getMe(@CurrentUser('sub') pilotId: string) {
    const profile = this.pilotService.getProfile(pilotId);

    return new SuccessResponse(HttpStatus.OK, 'Pilot profile retrieved', profile);
  }
}
