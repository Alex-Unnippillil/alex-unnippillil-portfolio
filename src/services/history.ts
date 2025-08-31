/**
 * A reversible operation represented as a callback. The callback can be
 * synchronous or return a promise.
 */
export type HistoryOperation = () => void | Promise<void>;

/**
 * Service that stores a stack of reversible operations. Each time an action is
 * executed, a compensating callback can be recorded via {@link record} or
 * {@link execute}.  The service allows the latest operations to be reverted in
 * a LIFO order using {@link undo}.  Multiple steps can be reverted at once by
 * passing a `steps` argument to {@link undo}.
 */
export class HistoryService {
  private stack: HistoryOperation[] = [];

  /**
   * Number of operations currently stored in the history stack.
   */
  get length(): number {
    return this.stack.length;
  }

  /**
   * Clears all stored history entries.
   */
  clear(): void {
    this.stack = [];
  }

  /**
   * Records a compensating operation.  The operation will be executed when
   * {@link undo} is called.
   */
  record(operation: HistoryOperation): void {
    this.stack.push(operation);
  }

  /**
   * Executes an action and records its undo callback. This helper simplifies
   * scenarios where the action and its compensation are defined together.
   */
  async execute(action: HistoryOperation, undo: HistoryOperation): Promise<void> {
    await action();
    this.record(undo);
  }

  /**
   * Undoes the last `steps` operations (defaults to one). Operations are
   * executed in reverse order of their registration. The method awaits each
   * callback which allows both synchronous and asynchronous undo handlers.
   */
  async undo(steps = 1): Promise<void> {
    while (steps > 0 && this.stack.length > 0) {
      const operation = this.stack.pop();
      // eslint-disable-next-line no-await-in-loop
      await operation?.();
      steps -= 1;
    }
  }
}

// A default instance exported for convenience.  Most consumers of the service
// use a singleton history stack.
const defaultHistory = new HistoryService();

export default defaultHistory;

