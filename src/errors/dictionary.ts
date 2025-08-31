export interface ErrorMessage {
  short: string;
  long: string;
}

export const ERROR_DICTIONARY: Record<string, ErrorMessage> = {
  UNKNOWN: {
    short: 'Unknown error',
    long: 'An unexpected error occurred.',
  },
  NOT_FOUND: {
    short: 'Not found',
    long: 'Requested resource could not be found.',
  },
  PERMISSION_DENIED: {
    short: 'Permission denied',
    long: 'You are not allowed to perform this action.',
  },
  TIMEOUT: {
    short: 'Timeout',
    long: 'The request to {{resource}} timed out.',
  },
};

export type ErrorKey = keyof typeof ERROR_DICTIONARY;
