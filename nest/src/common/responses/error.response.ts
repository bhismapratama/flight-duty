export class ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: string[];
  path: string;
  timestamp: string;

  constructor(init: ErrorResponse) {
    Object.assign(this, init);
  }
}
