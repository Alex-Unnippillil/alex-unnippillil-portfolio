const DANGEROUS_MIME_TYPES: string[] = [
  'application/javascript',
  'text/javascript',
  'application/ecmascript',
  'text/ecmascript',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-msdos-windows',
  'application/x-ms-dos-executable',
  'application/x-executable',
  'application/x-sh',
  'application/x-csh',
  'application/x-python',
];

/**
 * Checks whether the given MIME type is considered safe for previewing.
 */
export function isSafeMimeType(mime: string): boolean {
  return !DANGEROUS_MIME_TYPES.includes(mime);
}

/**
 * Returns a human readable message indicating the preview was blocked.
 */
export function blockedMessage(mime: string): string {
  return `Preview for ${mime} is blocked for security reasons.`;
}

export default {
  isSafeMimeType,
  blockedMessage,
};
