export interface FetchRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/* eslint-disable no-await-in-loop */
export default async function fetchWithRetry(
  url: string,
  options: FetchRetryOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 300,
    timeout,
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = timeout
      ? setTimeout(() => controller.abort(), timeout)
      : undefined;

    try {
      const response = await fetch(url, { ...fetchOptions, signal: controller.signal });

      if (!response.ok && response.status >= 500 && attempt < retries) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (timer) clearTimeout(timer);

      return response;
    } catch (error) {
      if (timer) clearTimeout(timer);

      if (attempt >= retries) {
        throw error;
      }

      const jitter = Math.random() * retryDelay;
      const delay = retryDelay * (2 ** attempt) + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should never reach here
  throw new Error('Failed to fetch');
}
