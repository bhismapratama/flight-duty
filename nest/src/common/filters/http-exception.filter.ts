import { STATUS_CODES } from 'node:http';

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ErrorResponse } from '../responses/error.response.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const { statusCode, message, details } = this.describe(exception);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json(
      new ErrorResponse({
        statusCode,
        error: STATUS_CODES[statusCode] ?? 'Error',
        message,
        ...(details && { details }),
        path: request.url,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  private describe(exception: unknown): {
    statusCode: number;
    message: string;
    details?: string[];
  } {
    if (!(exception instanceof HttpException)) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }

    const statusCode = exception.getStatus();
    const body = exception.getResponse();
    const raw = typeof body === 'string' ? body : (body as { message?: unknown }).message;

    if (Array.isArray(raw)) {
      const details = raw.map(String);

      return { statusCode, message: details[0] ?? 'Validation failed', details };
    }

    return {
      statusCode,
      message: typeof raw === 'string' ? raw : exception.message,
    };
  }
}
