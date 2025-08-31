import path from 'path';

export interface Capabilities {
  fetch: boolean;
  serviceWorker: boolean;
  localStorage: boolean;
}

export const FEATURES: (keyof Capabilities)[] = ['fetch', 'serviceWorker', 'localStorage'];

export function detectFeatures(env: any = globalThis): Capabilities {
  return {
    fetch: typeof env.fetch === 'function',
    serviceWorker: typeof env.navigator !== 'undefined' && 'serviceWorker' in env.navigator,
    localStorage: typeof env.localStorage !== 'undefined',
  };
}

export function getBrowser(userAgent?: string): string {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (/firefox/i.test(ua)) {
    return 'firefox';
  }
  if (/chrome|chromium|crios/i.test(ua)) {
    return 'chrome';
  }
  if (/safari/i.test(ua)) {
    return 'safari';
  }
  return 'unknown';
}

export function featureMatrix(env: any = globalThis): { [browser: string]: Capabilities } {
  const browser = getBrowser(env.navigator?.userAgent);
  return { [browser]: detectFeatures(env) };
}

export function loadFallbacks(features: Capabilities, dir: string = path.join(__dirname, '../components/fallbacks')): any[] {
  const loaded: any[] = [];
  Object.entries(features).forEach(([feature, supported]) => {
    if (!supported) {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const mod = require(path.join(dir, feature));
        loaded.push(mod.default || mod);
      } catch (e) {
        // ignore missing fallback
      }
    }
  });
  return loaded;
}
