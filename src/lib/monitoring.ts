/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

interface SentryEvent { [key: string]: any; }

function scrub(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
      .replace(/(token|authorization)=?[^\s]*/gi, '$1=[redacted]')
      .replace(/(?:[A-Za-z]:)?[\\/][^\s]+/g, '[redacted-path]');
  }
  if (Array.isArray(value)) {
    return value.map(scrub);
  }
  if (value && typeof value === 'object') {
    const result: any = {};
    Object.keys(value).forEach((k) => {
      result[k] = scrub(value[k]);
    });
    return result;
  }
  return value;
}

export function beforeSend(event: SentryEvent): SentryEvent {
  return scrub({ ...event });
}

export function initMonitoring(): void {
  const release = process.env.SENTRY_RELEASE || process.env.GITHUB_SHA;
  const environment = process.env.NODE_ENV || 'development';
  const options = {
    dsn: process.env.SENTRY_DSN,
    release,
    environment,
    beforeSend,
  };
  try {
    if (typeof window !== 'undefined') {
      const Sentry = require('@sentry/browser');
      Sentry.init(options);
    } else {
      const Sentry = require('@sentry/node');
      Sentry.init(options);
    }
  } catch (err) {
    // Sentry not available; ignore
  }
}

export default { initMonitoring, beforeSend };
