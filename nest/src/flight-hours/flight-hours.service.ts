import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { appConfig } from '@common';
import { DataService, type SummaryRange } from '@infra';
import { DailySeries, addDays, diffInDays, eachDay } from '@utils';

import type {
  ChartPoint,
  FlightHoursRange,
  FlightHoursSummary,
  LimitCard,
  LimitKey,
  LimitStatus,
} from './interface/index.js';

export const MAX_RANGE_DAYS = 366;
export const WARNING_RATIO = 0.8;

const LIMIT_WINDOWS: { key: LimitKey; label: string; windowDays: number }[] = [
  { key: 'daily', label: 'Daily', windowDays: 1 },
  { key: 'weekly', label: 'Weekly', windowDays: 7 },
  { key: 'monthly', label: 'Monthly', windowDays: 30 },
  { key: 'annual', label: 'Annual', windowDays: 365 },
];

@Injectable()
export class FlightHoursService {
  private readonly series: DailySeries;

  constructor(
    private readonly data: DataService,
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {
    this.series = new DailySeries(data.flightHours.flightHours);
  }

  getDailyHours(from: string, to: string): FlightHoursRange {
    if (from > to) {
      throw new BadRequestException('from must be on or before to');
    }

    if (diffInDays(from, to) + 1 > MAX_RANGE_DAYS) {
      throw new BadRequestException(`Date range cannot exceed ${MAX_RANGE_DAYS} days`);
    }

    const { today } = this.app;

    return {
      from,
      to,
      today,
      totalHours: this.series.sumBetween(from, to),
      days: eachDay(from, to).map(date => ({
        date,
        hours: this.series.hoursOn(date),
        isFuture: date > today,
      })),
    };
  }

  getSummary(range: SummaryRange): FlightHoursSummary {
    const { today } = this.app;
    const bound = this.data.flightHours.chartBounds[range];

    const points: ChartPoint[] = eachDay(
      addDays(today, -bound.displayRangeDays),
      addDays(today, bound.displayRangeDays),
    ).map(date => {
      const { value, isPartialWindow } = this.series.rollingSum(date, bound.windowDays);

      return {
        date,
        value,
        isToday: date === today,
        isFuture: date > today,
        isPartialWindow,
        isOverLimit: value > bound.limit,
      };
    });

    const peak = Math.max(...points.map(point => point.value));

    return {
      today,
      range,
      cards: this.getLimitCards(today),
      chart: {
        windowDays: bound.windowDays,
        limit: bound.limit,
        max: bound.max,
        yAxisMax: Math.max(bound.max, Math.ceil(peak)),
        points,
      },
    };
  }

  private getLimitCards(today: string): LimitCard[] {
    const { limits } = this.data.flightHours;

    return LIMIT_WINDOWS.map(({ key, label, windowDays }) => {
      const limit = limits[key];
      const hours = this.series.rollingSum(today, windowDays).value;

      return {
        key,
        label,
        windowDays,
        hours,
        limit,
        remaining: roundOneDecimal(Math.max(limit - hours, 0)),
        percentage: roundOneDecimal((hours / limit) * 100),
        status: toLimitStatus(hours, limit),
      };
    });
  }
}

function toLimitStatus(hours: number, limit: number): LimitStatus {
  if (hours > limit) {
    return 'exceeded';
  }

  return hours >= limit * WARNING_RATIO ? 'warning' : 'safe';
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
