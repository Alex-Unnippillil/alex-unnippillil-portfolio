export interface RetryOptions {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  jitter?: boolean;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function retry<T>(
  fn: () => Promise<T>,
  {
    retries = 3,
    factor = 2,
    minTimeout = 100,
    maxTimeout = 1000,
    jitter = true,
  }: RetryOptions = {},
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries) {
        throw err;
      }

      let timeout = Math.min(maxTimeout, minTimeout * factor ** (attempt - 1));
      if (jitter) {
        timeout = Math.random() * timeout;
      }

      // eslint-disable-next-line no-await-in-loop
      await wait(timeout);
    }
  }
}
