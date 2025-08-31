// Key-value cache with TTL per endpoint and deterministic keys

interface CacheEntry<T = any> {
  value: T;
  expires: number;
}

// Map for cached entries
const cache = new Map<string, CacheEntry>();

// TTL configuration per endpoint (milliseconds)
const ttls: Record<string, number> = {};

let hits = 0;
let misses = 0;

const DEFAULT_TTL = 60_000; // 1 minute

/**
 * Create deterministic string representation of params
 */
function stableStringify(value: any): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  const props = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
  return `{${props.join(',')}}`;
}

function makeKey(endpoint: string, params: any): string {
  return `${endpoint}:${stableStringify(params)}`;
}

export function setTTL(endpoint: string, ttl: number): void {
  ttls[endpoint] = ttl;
}

export function get<T = any>(endpoint: string, params: any): T | undefined {
  const key = makeKey(endpoint, params);
  const entry = cache.get(key);
  const now = Date.now();

  if (entry && entry.expires > now) {
    hits += 1;
    return entry.value as T;
  }

  if (entry) {
    cache.delete(key);
  }
  misses += 1;
  return undefined;
}

export function set<T = any>(endpoint: string, params: any, value: T): void {
  const ttl = ttls[endpoint] ?? DEFAULT_TTL;
  const key = makeKey(endpoint, params);
  cache.set(key, { value, expires: Date.now() + ttl });
}

export function stats() {
  const total = hits + misses;
  return {
    hits,
    misses,
    hitRate: total === 0 ? 0 : hits / total,
    size: cache.size,
  };
}

// Utility to purge expired entries
export function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expires <= now) {
      cache.delete(key);
    }
  }
}

export default {
  setTTL,
  get,
  set,
  stats,
  purgeExpired,
};
