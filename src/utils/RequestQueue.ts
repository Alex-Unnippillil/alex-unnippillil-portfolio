export interface QueueState {
  endpoint: string;
  queued: number;
  running: number;
  concurrency: number;
}

type Task<T> = () => Promise<T>;

type Listener = (state: QueueState) => void;

interface Queue {
  concurrency: number;
  running: number;
  tasks: Task<any>[];
}

export default class RequestQueue {
  private queues: Map<string, Queue> = new Map();

  private listeners: Listener[] = [];

  private defaultConcurrency: number;

  constructor(defaultConcurrency = 4) {
    this.defaultConcurrency = defaultConcurrency;
  }

  public setConcurrency(endpoint: string, limit: number): void {
    const queue = this.getQueue(endpoint);
    queue.concurrency = limit;
    this.emit(endpoint);
  }

  public enqueue<T>(endpoint: string, task: Task<T>): Promise<T> {
    const queue = this.getQueue(endpoint);
    return new Promise<T>((resolve, reject) => {
      queue.tasks.push(() => task().then(resolve, reject));
      this.emit(endpoint);
      this.next(endpoint);
    });
  }

  public onChange(listener: Listener): void {
    this.listeners.push(listener);
  }

  public getTotalQueued(): number {
    let total = 0;
    this.queues.forEach((q) => { total += q.tasks.length; });
    return total;
  }

  public hasPaused(): boolean {
    let paused = false;
    this.queues.forEach((q) => {
      if (q.tasks.length > 0 && q.running >= q.concurrency) {
        paused = true;
      }
    });
    return paused;
  }

  private next(endpoint: string): void {
    const queue = this.getQueue(endpoint);
    if (queue.running >= queue.concurrency) {
      return;
    }
    const task = queue.tasks.shift();
    if (!task) {
      this.emit(endpoint);
      return;
    }
    queue.running += 1;
    this.emit(endpoint);
    task().finally(() => {
      queue.running -= 1;
      this.emit(endpoint);
      this.next(endpoint);
    });
  }

  private emit(endpoint: string): void {
    const queue = this.getQueue(endpoint);
    const state: QueueState = {
      endpoint,
      queued: queue.tasks.length,
      running: queue.running,
      concurrency: queue.concurrency,
    };
    this.listeners.forEach((l) => l(state));
  }

  private getQueue(endpoint: string): Queue {
    if (!this.queues.has(endpoint)) {
      this.queues.set(endpoint, {
        concurrency: this.defaultConcurrency,
        running: 0,
        tasks: [],
      });
    }
    return this.queues.get(endpoint)!;
  }
}
