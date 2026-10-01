import { addDays, fromEpochDay, toEpochDay } from './date.js';

export interface DailyEntry {
  date: string;
  hours: number;
}

export interface WindowSum {
  value: number;
  isPartialWindow: boolean;
}

export class DailySeries {
  readonly firstDate: string;
  readonly lastDate: string;

  private readonly firstDay: number;
  private readonly prefix: number[];

  constructor(entries: DailyEntry[]) {
    if (entries.length === 0) {
      throw new Error('DailySeries needs at least one entry');
    }

    const days = entries.map(entry => toEpochDay(entry.date));
    this.firstDay = Math.min(...days);
    const lastDay = Math.max(...days);

    const tenths = Array.from({ length: lastDay - this.firstDay + 1 }, () => 0);

    entries.forEach((entry, index) => {
      tenths[days[index] - this.firstDay] += Math.round(entry.hours * 10);
    });

    this.prefix = [0];
    for (const value of tenths) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + value);
    }

    this.firstDate = fromEpochDay(this.firstDay);
    this.lastDate = fromEpochDay(lastDay);
  }

  hoursOn(date: string): number {
    return this.sumBetween(date, date);
  }

  sumBetween(from: string, to: string): number {
    const lastIndex = this.prefix.length - 1;
    const start = clamp(toEpochDay(from) - this.firstDay, 0, lastIndex);
    const end = clamp(toEpochDay(to) - this.firstDay + 1, 0, lastIndex);

    return end > start ? (this.prefix[end] - this.prefix[start]) / 10 : 0;
  }

  rollingSum(endDate: string, windowDays: number): WindowSum {
    const startDate = addDays(endDate, -(windowDays - 1));

    return {
      value: this.sumBetween(startDate, endDate),
      isPartialWindow: startDate < this.firstDate || endDate > this.lastDate,
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
