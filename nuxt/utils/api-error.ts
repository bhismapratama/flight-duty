import type { ApiError } from '~/types/api';

interface FetchLikeError {
  statusCode?: number;
  status?: number;
  message?: string;
  data?: Partial<ApiError>;
}

const NETWORK_MESSAGE = 'Cannot reach the server. Check your connection and try again.';
const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
const NO_RESPONSE_MARKER = '<no response>';

export function getErrorStatus(error: unknown): number | undefined {
  const candidate = error as FetchLikeError | null;
  return candidate?.statusCode ?? candidate?.status ?? candidate?.data?.statusCode;
}

export function getErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE): string {
  const candidate = error as FetchLikeError | null;
  const message = candidate?.data?.message;
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }
  if (isNetworkFailure(error)) {
    return NETWORK_MESSAGE;
  }
  return fallback;
}

function isNetworkFailure(error: unknown): boolean {
  const candidate = error as FetchLikeError | null;
  const message = candidate?.message;
  return (
    getErrorStatus(error) === undefined ||
    (typeof message === 'string' && message.includes(NO_RESPONSE_MARKER))
  );
}
