export interface CacheKeyParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Generate a cache key based on url, query parameters and session/auth context.
 * Query parameters are sorted to ensure consistent key generation.
 */
export function createCacheKey(
  url: string,
  params: CacheKeyParams = {},
  session: string | undefined = undefined,
): string {
  const searchParams = new URLSearchParams();
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

  const query = searchParams.toString();
  return [url, query, session || ''].filter(Boolean).join('|');
}

export default createCacheKey;
