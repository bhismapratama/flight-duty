export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: string[];
  path: string;
  timestamp: string;
}

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';
