import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, type JwtModuleOptions, type JwtSignOptions } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import {
  ClientIpThrottlerGuard,
  JwtGuard,
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_MESSAGE,
  THROTTLE_TTL_MS,
  appConfig,
  jwtConfig,
  validateEnv,
} from '@common';
import { DataModule } from '@infra';

import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { FlightHoursModule } from './flight-hours/flight-hours.module.js';
import { PilotModule } from './pilot/pilot.module.js';
import { SchedulesModule } from './schedules/schedules.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
      validate: validateEnv,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (jwt: ConfigType<typeof jwtConfig>): JwtModuleOptions => ({
        secret: jwt.secret,
        signOptions: { expiresIn: jwt.expiresIn as JwtSignOptions['expiresIn'] },
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: THROTTLE_TTL_MS, limit: THROTTLE_DEFAULT_LIMIT }],
      errorMessage: THROTTLE_MESSAGE,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    DataModule,

    AuthModule,
    PilotModule,
    FlightHoursModule,
    DocumentsModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ClientIpThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
