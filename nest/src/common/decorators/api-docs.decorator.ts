import { STATUS_CODES } from 'node:http';

import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiSuccess(message: string, data: unknown) {
  return ApiResponse({
    status: 200,
    description: message,
    schema: { example: { statusCode: 200, message, data } },
  });
}

export function ApiFailures(path: string, ...failures: [statusCode: number, message: string][]) {
  return applyDecorators(
    ...failures.map(([statusCode, message]) =>
      ApiResponse({
        status: statusCode,
        description: message,
        schema: {
          example: {
            statusCode,
            error: STATUS_CODES[statusCode],
            message,
            path,
            timestamp: '2026-05-15T08:00:00.000Z',
          },
        },
      }),
    ),
  );
}
