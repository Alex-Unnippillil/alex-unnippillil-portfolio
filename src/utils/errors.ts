export enum ErrorCode {
  UNKNOWN = 'unknown',
  MISSING_DATA = 'missing_data',
  INVALID_STATE = 'invalid_state',
}

export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: 'An unknown error occurred',
  [ErrorCode.MISSING_DATA]: 'Required data is missing',
  [ErrorCode.INVALID_STATE]: 'Application is in an invalid state',
};

export class DomainError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? errorMessages[code]);
    this.code = code;
    this.name = 'DomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function invariant(condition: any, code: ErrorCode, message?: string): asserts condition {
  if (!condition) {
    throw new DomainError(code, message);
  }
}

export function handleError(err: unknown): { code: ErrorCode; message: string } {
  if (err instanceof DomainError) {
    return {
      code: err.code,
      message: errorMessages[err.code] ?? err.message,
    };
  }

  return { code: ErrorCode.UNKNOWN, message: errorMessages[ErrorCode.UNKNOWN] };
}
