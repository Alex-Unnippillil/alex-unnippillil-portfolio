import { store } from '../../state/store';

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  cacheKey?: string;
  tags?: string[];
  invalidateTags?: string[];
  signal?: AbortSignal;
}

export type RequestExecutor<T> = (signal: AbortSignal) => Promise<T>;

export default async function request<T>(
  executor: RequestExecutor<T>,
  options: RequestOptions = {},
): Promise<T> {
  const {
    timeout,
    retries = 0,
    cacheKey,
    tags = [],
    invalidateTags = [],
    signal,
  } = options;

  if (cacheKey) {
    const cached = store.get<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
  }

  let attempt = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort());
      }
    }

    if (timeout !== undefined) {
      timer = setTimeout(() => controller.abort(), timeout);
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await executor(controller.signal);
      if (cacheKey) {
        store.set(cacheKey, result, tags);
      }
      if (invalidateTags.length) {
        store.invalidate(invalidateTags);
      }
      return result;
    } catch (err) {
      if (controller.signal.aborted && attempt >= retries) {
        throw err;
      }
      if (attempt >= retries) {
        throw err;
      }
      attempt += 1;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }
}
