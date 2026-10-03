import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  type ThrottlerModuleOptions,
  type ThrottlerStorage,
} from '@nestjs/throttler';
import type { Request } from 'express';

import { throttleConfig } from '../config/throttle.config.js';

@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storageService: ThrottlerStorage,
    reflector: Reflector,
    @Inject(throttleConfig.KEY)
    private readonly throttle: ConfigType<typeof throttleConfig>,
  ) {
    super(options, storageService, reflector);
  }

  protected override getTracker(request: Request): Promise<string> {
    return Promise.resolve(resolveClientIp(request, this.throttle.trustCfConnectingIp));
  }
}

export function resolveClientIp(
  request: Pick<Request, 'headers' | 'ip'>,
  trustCfConnectingIp: boolean,
): string {
  const forwarded = request.headers['cf-connecting-ip'];

  if (trustCfConnectingIp && typeof forwarded === 'string' && forwarded) {
    return forwarded;
  }

  return request.ip ?? 'unknown';
}
