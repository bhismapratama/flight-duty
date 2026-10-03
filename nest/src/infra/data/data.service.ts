import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable, Logger } from '@nestjs/common';

import { DailySeries, isIsoDate } from '@utils';

import type { DocumentsSeed, FlightHoursSeed, SchedulesSeed } from './interface/index.js';

const SEED_DIR = join(import.meta.dirname, 'seed');

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  readonly flightHours: FlightHoursSeed;
  readonly documents: DocumentsSeed;
  readonly schedules: SchedulesSeed;
  readonly flightSeries: DailySeries;

  constructor() {
    this.flightHours = readSeed<FlightHoursSeed>('flight-hours.json');
    this.documents = readSeed<DocumentsSeed>('documents.json');
    this.schedules = readSeed<SchedulesSeed>('schedules.json');

    assertDates(
      'flight-hours.json',
      this.flightHours.flightHours.map(entry => entry.date),
    );
    assertDates(
      'documents.json',
      this.documents.documents.map(entry => entry.expiryDate),
    );
    assertDates(
      'schedules.json',
      this.schedules.schedules.map(entry => entry.duty_date),
    );

    this.flightSeries = new DailySeries(this.flightHours.flightHours);

    this.logger.log(
      `Seeded ${this.flightHours.flightHours.length} flight-hour days, ` +
        `${this.documents.documents.length} documents, ` +
        `${this.schedules.schedules.length} schedule entries`,
    );
  }
}

function readSeed<T>(fileName: string): T {
  try {
    return JSON.parse(readFileSync(join(SEED_DIR, fileName), 'utf8')) as T;
  } catch (error) {
    throw new Error(`Cannot load seed file ${fileName}: ${(error as Error).message}`);
  }
}

function assertDates(fileName: string, dates: string[]): void {
  const invalid = dates.find(date => !isIsoDate(date));

  if (invalid !== undefined) {
    throw new Error(`Seed file ${fileName} contains an invalid date: ${JSON.stringify(invalid)}`);
  }
}
