
export type Variant = 'A' | 'B';

interface ExperimentResult {
  name: string;
  variant: Variant;
  timestamp: string;
}

const SECRET = 'gportfolio-flag-secret';
const STORAGE_KEY = 'experiments';

function sign(value: string): string {
  let hash = 0;
  const str = `${value}${SECRET}`;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

function parseCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {};
  }
  return document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split('=');
    if (k && v) {
      acc[k.trim()] = decodeURIComponent(v.trim());
    }
    return acc;
  }, {});
}

function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name: string): string | undefined {
  return parseCookies()[name];
}

function setSignedCookie(name: string, value: string): void {
  const signature = sign(value);
  setCookie(name, `${value}.${signature}`);
}

function getSignedCookie(name: string): string | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  const [value, signature] = raw.split('.');
  return signature === sign(value) ? value : undefined;
}

export function getFlag(name: string): string | undefined {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has(name)) {
      const value = params.get(name)!;
      setCookie(name, value);
      return value;
    }
  }
  return getCookie(name);
}

export function getABVariant(name: string): Variant {
  const flag = `ab_${name}`;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramVariant = params.get(flag);
    if (paramVariant === 'A' || paramVariant === 'B') {
      setSignedCookie(flag, paramVariant);
      return paramVariant;
    }
  }
  const cookieVariant = getSignedCookie(flag);
  if (cookieVariant === 'A' || cookieVariant === 'B') {
    return cookieVariant;
  }
  const variant: Variant = Math.random() < 0.5 ? 'A' : 'B';
  setSignedCookie(flag, variant);
  return variant;
}

export function recordExperiment(name: string, variant: Variant): void {
  if (typeof localStorage === 'undefined') return;
  const list = getExperimentResults();
  list.push({ name, variant, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getExperimentResults(): ExperimentResult[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ExperimentResult[]) : [];
  } catch (e) {
    return [];
  }
}

export function clearExperimentResults(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export type { ExperimentResult };
