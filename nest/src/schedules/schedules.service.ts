import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { appConfig } from '@common';
import { DataService } from '@infra';
import { toYearMonth } from '@utils';

import type { MonthSchedule } from './interface/index.js';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly data: DataService,
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {}

  getMonth(year: number, month: number): MonthSchedule {
    const prefix = `${toYearMonth(year, month)}-`;
    const { legend, schedules } = this.data.schedules;

    const items = schedules
      .filter(entry => entry.duty_date.startsWith(prefix))
      .sort((a, b) => a.duty_date.localeCompare(b.duty_date))
      .map(entry => ({
        ...entry,
        remaining: Math.max(entry.count_schedules - entry.count_logbooks, 0),
        is_complete: entry.count_logbooks === entry.count_schedules,
      }));

    return { year, month, today: this.app.today, legend, items };
  }
}
