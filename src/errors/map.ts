import { ERROR_DICTIONARY, ErrorKey, ErrorMessage } from './dictionary';

export const SERVER_ERROR_MAP: Record<string, ErrorKey> = {
  ENOENT: 'NOT_FOUND',
  EACCES: 'PERMISSION_DENIED',
  ETIMEDOUT: 'TIMEOUT',
  ECONNABORTED: 'TIMEOUT',
};

export function mapServerErrorCode(code: string): ErrorMessage {
  const key = SERVER_ERROR_MAP[code] || 'UNKNOWN';
  return ERROR_DICTIONARY[key];
}
