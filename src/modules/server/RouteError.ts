import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export default class RouteError extends Error {
  public status: number;

  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  public toJSON(): ErrorResponse {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
    };
  }
}

export function toErrorResponse(err: unknown): ErrorResponse {
  if (err instanceof RouteError) {
    return err.toJSON();
  }

  if (err && typeof err === 'object' && 'status' in err && 'code' in err && 'message' in err) {
    const e = err as { status: number; code: string; message: string };
    return { status: e.status, code: e.code, message: e.message };
  }

  return {
    status: 500,
    code: 'InternalError',
    message: err instanceof Error ? err.message : 'Unknown error',
  };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const response = toErrorResponse(err);
  res.status(response.status).json(response);
}
/* eslint-enable @typescript-eslint/no-unused-vars */
