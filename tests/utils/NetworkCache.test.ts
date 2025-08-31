import NetworkCache from '../../src/services/cache/NetworkCache';

describe('NetworkCache', () => {
  it('dedupes concurrent requests', async () => {
    const cache = new NetworkCache();
    const fetcher = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve('data'), 50)));
    const key = 'concurrent';

    const [r1, r2] = await Promise.all([
      cache.fetch(key, 1000, fetcher),
      cache.fetch(key, 1000, fetcher),
    ]);

    expect(r1).toBe('data');
    expect(r2).toBe('data');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('returns stale data while revalidating', async () => {
    const cache = new NetworkCache();
    const fetcher = jest.fn().mockResolvedValue('fresh');
    const key = 'stale';

    await cache.fetch(key, 50, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await new Promise((r) => setTimeout(r, 60));

    const slowFetcher = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve('updated'), 100)));
    const start = Date.now();
    const result = await cache.fetch(key, 50, slowFetcher);
    const duration = Date.now() - start;

    expect(result).toBe('fresh');
    expect(duration).toBeLessThan(80);
    expect(slowFetcher).toHaveBeenCalledTimes(1);

    await new Promise((r) => setTimeout(r, 120));
    const final = await cache.fetch(key, 50, slowFetcher);
    expect(final).toBe('updated');
    expect(slowFetcher).toHaveBeenCalledTimes(1);
  });
});
