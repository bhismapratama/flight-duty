import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { PILOT_ACCOUNT, appConfig } from '@common';
import { DataService } from '@infra';

import type { PilotProfile } from './interface/index.js';

export const AVATAR_PATH = '/static/avatar.svg';

@Injectable()
export class PilotService {
  constructor(
    private readonly data: DataService,
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {}

  getProfile(pilotId: string): PilotProfile {
    if (pilotId !== PILOT_ACCOUNT.id) {
      throw new NotFoundException('Pilot not found');
    }

    const { pilot } = this.data.flightHours;

    return {
      id: PILOT_ACCOUNT.id,
      username: PILOT_ACCOUNT.username,
      name: pilot.name,
      totalFlightHours: pilot.totalFlightHours,
      avatarUrl: `${this.app.baseUrl}${AVATAR_PATH}`,
      today: this.app.today,
    };
  }
}
