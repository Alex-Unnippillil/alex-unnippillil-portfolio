import {
  setTimeout as setTimeoutSafe,
  clearTimeout as clearTimeoutSafe,
  setInterval as setIntervalSafe,
  clearInterval as clearIntervalSafe,
} from 'timers';

export interface DeleteOperation {
  undo: () => void;
  promise: Promise<void>;
}

export interface DeleteOptions {
  delayMs?: number;
  intervalMs?: number;
  onTick?: (msLeft: number) => void;
}

export default class DeleteManager {
  static schedule(
    action: () => void | Promise<void>,
    options: DeleteOptions = {},
  ): DeleteOperation {
    const { delayMs = 5000, intervalMs = 1000, onTick } = options;

    let undone = false;
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout | undefined;

    const promise = new Promise<void>((resolve, reject) => {
      let msLeft = delayMs;
      if (onTick) {
        onTick(msLeft);
        interval = setIntervalSafe(() => {
          msLeft -= intervalMs;
          if (msLeft > 0) {
            onTick(msLeft);
          } else {
            onTick(0);
            clearIntervalSafe(interval as NodeJS.Timeout);
          }
        }, intervalMs);
      }

      timeout = setTimeoutSafe(() => {
        if (interval) {
          clearIntervalSafe(interval);
        }
        if (undone) {
          resolve();
          return;
        }
        Promise.resolve(action())
          .then(resolve)
          .catch(reject);
      }, delayMs);
    });

    return {
      undo: () => {
        if (!undone) {
          undone = true;
          clearTimeoutSafe(timeout);
          if (interval) {
            clearIntervalSafe(interval);
          }
        }
      },
      promise,
    };
  }
}
