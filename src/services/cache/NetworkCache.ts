interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

/**
 * NetworkCache provides deduplication of in-flight requests and
 * stale-while-revalidate caching with configurable TTL.
 */
export default class NetworkCache {
  private cache = new Map<string, CacheEntry<any>>();

  private inFlight = new Map<string, Promise<any>>();

  /**
   * Fetch data associated with the provided key. If a fresh cache entry exists it is
   * returned. When the entry is stale the stale data is returned immediately while a
   * background revalidation is triggered. Concurrent identical requests share the same
   * network call.
   */
  public async fetch<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const now = Date.now();
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (entry) {
      const isFresh = now - entry.timestamp < ttl;
      if (isFresh) {
        return entry.data;
      }

      if (!this.inFlight.has(key)) {
        const revalidatePromise = fetcher()
          .then((data) => {
            this.cache.set(key, { data, timestamp: Date.now() });
            this.inFlight.delete(key);
            return data;
          })
          .catch((err) => {
            this.inFlight.delete(key);
            throw err;
          });
        this.inFlight.set(key, revalidatePromise);
      }

      return entry.data;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key)!;
    }

    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, { data, timestamp: Date.now() });
        this.inFlight.delete(key);
        return data;
      })
      .catch((err) => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, promise);
    return promise;
  }
}
