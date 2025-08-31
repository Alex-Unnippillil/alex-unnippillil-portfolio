export interface CacheEntry<T> {
  value: T;
  expires: number;
}

export class KVCache {
  private store = new Map<string, CacheEntry<unknown>>();

  private hits = 0;

  private misses = 0;

  private buildKey(endpoint: string, params: Record<string, unknown>): string {
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
      .map((k) => `${k}:${JSON.stringify(params[k])}`)
      .join('|');
    return `${endpoint}|${paramString}`;
  }

  get<T>(endpoint: string, params: Record<string, unknown>): T | undefined {
    const key = this.buildKey(endpoint, params);
    const entry = this.store.get(key);
    if (!entry) {
      this.misses += 1;
      return undefined;
    }
    if (entry.expires < Date.now()) {
      this.store.delete(key);
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return entry.value as T;
  }

  set<T>(endpoint: string, params: Record<string, unknown>, value: T, ttl: number): void {
    const key = this.buildKey(endpoint, params);
    this.store.set(key, { value, expires: Date.now() + ttl });
  }

  async getOrSet<T>(
    endpoint: string,
    params: Record<string, unknown>,
    loader: () => Promise<T> | T,
    ttl: number,
  ): Promise<T> {
    const cached = this.get<T>(endpoint, params);
    if (cached !== undefined) {
      return cached;
    }
    const value = await loader();
    this.set(endpoint, params, value, ttl);
    return value;
  }

  hitRate(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : this.hits / total;
  }

  status(): { hits: number; misses: number; hitRate: number } {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hitRate(),
    };
  }
}

const kvCache = new KVCache();
export default kvCache;
