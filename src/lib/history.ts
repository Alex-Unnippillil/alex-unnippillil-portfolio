export interface HistoryEntry {
  /**
   * Human readable description of the action that produced the entry.
   */
  description?: string;
  /**
   * Arbitrary snapshot associated with the change.
   */
  state?: unknown;
  /**
   * Optional rollback handler which will be executed on undo.
   */
  rollback?: () => void;
}

/**
 * Simple in-memory history manager that supports multi-step undo.
 *
 * Each call to {@link push} records a new {@link HistoryEntry}. Subsequent
 * calls to {@link undo} walk the history backwards invoking entry specific
 * rollback handlers.  The manager behaves similar to the undo stack of text
 * editors – new actions wipe out the redo history.
 */
export default class HistoryManager {
  private stack: HistoryEntry[] = [];

  private pointer = -1; // index of last applied action

  /**
   * Record a new history entry.
   * Any entries that were previously undone are discarded to mirror typical
   * editor behaviour.
   */
  push(entry: HistoryEntry): void {
    // Remove anything after the current pointer so that new actions become
    // the new "future".
    if (this.pointer < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.pointer + 1);
    }
    this.stack.push(entry);
    this.pointer = this.stack.length - 1;
  }

  /**
   * Undo the specified number of steps (defaults to one).
   * Returns the entries that were undone in the order they were reverted.
   */
  undo(steps = 1): HistoryEntry[] {
    const undone: HistoryEntry[] = [];
    while (steps > 0 && this.pointer >= 0) {
      const current = this.stack[this.pointer];
      if (current?.rollback) {
        try {
          current.rollback();
        } catch {
          /* ignore rollback errors */
        }
      }
      undone.push(current);
      this.pointer -= 1;
      steps -= 1;
    }
    return undone;
  }

  /**
   * Whether there are any actions that can be undone.
   */
  canUndo(): boolean {
    return this.pointer >= 0;
  }

  /**
   * Clear the entire history stack.
   */
  clear(): void {
    this.stack = [];
    this.pointer = -1;
  }
}
