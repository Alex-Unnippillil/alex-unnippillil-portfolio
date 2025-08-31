export type EmptyReason = 'none' | 'no-data' | 'error' | 'auth';

interface EmptyRender {
  reason: EmptyReason;
  timestamp: number;
}

export interface EmptyPopulate extends EmptyRender {
  duration: number;
}

export default class EmptyStateTracker {
  private static renders: Map<string, EmptyRender> = new Map();

  private static history: EmptyPopulate[] = [];

  /**
   * Emit an event when an empty state is rendered.
   * @param id unique identifier of the empty screen
   * @param reason cause of the empty state
   */
  static emitRender(id: string, reason: EmptyReason): void {
    this.renders.set(id, { reason, timestamp: Date.now() });
  }

  /**
   * Emit an event when an empty state receives content.
   * Returns details including how long the screen stayed empty.
   * @param id identifier used in emitRender
   */
  static emitPopulation(id: string): EmptyPopulate | undefined {
    const render = this.renders.get(id);
    if (!render) return undefined;

    const duration = Date.now() - render.timestamp;
    const populate: EmptyPopulate = { ...render, duration };
    this.history.push(populate);
    this.renders.delete(id);
    return populate;
  }

  /**
   * Get all recorded empty durations for dashboards.
   */
  static durations(): EmptyPopulate[] {
    return this.history;
  }

  /**
   * Reset tracked events (mainly for tests).
   */
  static reset(): void {
    this.renders.clear();
    this.history = [];
  }

  /**
   * Provide a call-to-action message based on reason.
   */
  static ctaFor(reason: EmptyReason): string {
    switch (reason) {
      case 'no-data':
        return 'Add your first item';
      case 'error':
        return 'Retry';
      case 'auth':
        return 'Sign in';
      default:
        return 'Learn more';
    }
  }
}
