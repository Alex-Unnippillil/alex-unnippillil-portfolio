export default function networkPause() {
  const originalFetch = window.fetch.bind(window);

  type QueuedRequest = {
    args: Parameters<typeof fetch>;
    resolve: (value: Response) => void;
    reject: (reason?: unknown) => void;
  };

  const queue: QueuedRequest[] = [];
  let paused = document.hidden;

  const processQueue = () => {
    while (queue.length > 0) {
      const { args, resolve, reject } = queue.shift()!;
      originalFetch(...args).then(resolve).catch(reject);
    }
  };

  const wrappedFetch = (
    ...args: Parameters<typeof fetch>
  ): Promise<Response> => {
    if (paused) {
      return new Promise<Response>((resolve, reject) => {
        queue.push({ args, resolve, reject });
      });
    }
    return originalFetch(...args);
  };

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) {
      processQueue();
    }
  });

  window.fetch = wrappedFetch;
}
