export type FeatureFlags = { [key: string]: any };

export type FeatureFlagListener = (flags: FeatureFlags) => void;

interface FeatureFlagClient {
  subscribe(listener: FeatureFlagListener): () => void;
  getFlags(): FeatureFlags;
}

export function createFeatureFlagClient(
  url = '/api/feature-flags',
  interval = 60000,
): FeatureFlagClient {
  let etag: string | null = null;
  let flags: FeatureFlags = {};
  const listeners: FeatureFlagListener[] = [];

  async function poll(): Promise<void> {
    try {
      const headers: { [key: string]: string } = {};
      if (etag) {
        headers['If-None-Match'] = etag;
      }

      const response = await fetch(url, { headers });
      if (response.status === 200) {
        etag = response.headers.get('ETag');
        flags = await response.json();
        listeners.forEach((l) => l(flags));
      }
    } catch {
      // ignore network errors
    }
  }

  setInterval(poll, interval);
  poll();

  return {
    subscribe(listener: FeatureFlagListener): () => void {
      listeners.push(listener);
      listener(flags);
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      };
    },
    getFlags(): FeatureFlags {
      return flags;
    },
  };
}
