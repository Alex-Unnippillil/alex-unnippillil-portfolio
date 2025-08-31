export const DANGEROUS_TYPES = new Set([
  'text/html',
  'application/javascript',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-sh',
  'application/x-bat',
]);

export function isSafeType(type: string): boolean {
  if (!type || DANGEROUS_TYPES.has(type)) {
    return false;
  }
  if (type.startsWith('image/') || type.startsWith('video/')) {
    return true;
  }
  if (type === 'text/plain' || type.startsWith('text/')) {
    return true;
  }
  if (type === 'application/json') {
    return true;
  }
  return false;
}
