import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable, Logger } from '@nestjs/common';

import { DailySeries } from '@utils';

import type { DocumentsSeed, FlightHoursSeed, SchedulesSeed } from './interface/index.js';
import { assertDocumentsSeed, assertFlightHoursSeed, assertSchedulesSeed } from './seed.validation.js';

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

    assertFlightHoursSeed(this.flightHours);
    assertDocumentsSeed(this.documents);
    assertSchedulesSeed(this.schedules);

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
