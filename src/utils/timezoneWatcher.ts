export type TimezoneChangeCallback = (previousOffset: number, currentOffset: number) => void;

/**
 * Watches for large timezone offset changes and notifies the user so they can
 * adjust event times or other time sensitive data.
 *
 * @param thresholdMinutes Minimum difference in minutes considered a shift.
 * @param cb Callback executed when the shift is detected.
 * @returns A function that stops watching when called.
 */
export function watchTimezone(
  thresholdMinutes: number,
  cb?: TimezoneChangeCallback,
): () => void {
  let lastOffset = new Date().getTimezoneOffset();
  const callback = cb ?? defaultPrompt;
  const interval = setInterval(() => {
    const offset = new Date().getTimezoneOffset();
    if (Math.abs(offset - lastOffset) >= thresholdMinutes) {
      callback(lastOffset, offset);
      lastOffset = offset;
    }
  }, 60_000);
  return () => clearInterval(interval);
}

function defaultPrompt(previous: number, current: number): void {
  if (typeof window !== 'undefined') {
    const message = `Timezone changed from UTC${formatOffset(previous)} to UTC${formatOffset(current)}. Please adjust your settings.`;
    // eslint-disable-next-line no-alert
    window.alert(message);
  }
}

function formatOffset(offset: number): string {
  const sign = offset > 0 ? '-' : '+';
  const abs = Math.abs(offset);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}
