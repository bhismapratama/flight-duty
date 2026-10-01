import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(request: Request): Promise<string> {
    const forwarded = request.headers['cf-connecting-ip'];
    const clientIp = typeof forwarded === 'string' && forwarded ? forwarded : request.ip;

    return Promise.resolve(clientIp ?? 'unknown');
  }
}
