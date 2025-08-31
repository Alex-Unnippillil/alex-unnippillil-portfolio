export type EventHandler<T = any> = (payload: T) => void;

class EventBus {
  private handlers: Record<string, Set<EventHandler>> = {};

  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    this.handlers[event].add(handler as EventHandler);
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    this.handlers[event]?.delete(handler as EventHandler);
  }

  emit<T>(event: string, payload: T): void {
    this.handlers[event]?.forEach((handler) => {
      try {
        (handler as EventHandler<T>)(payload);
      } catch (error) {
        console.error(`event handler for "${event}" failed`, error);
      }
    });
  }
}

export interface TimingPayload {
  route: string;
  device: string;
  duration: number;
}

export const events = new EventBus();

events.on<TimingPayload>('timing', ({ route, device, duration }) => {
  if (typeof window !== 'undefined') {
    const { va } = window as any;
    va?.track('timing', { route, device, duration });
  }
});

export default events;
