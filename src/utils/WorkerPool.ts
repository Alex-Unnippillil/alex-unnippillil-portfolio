import PriorityTaskQueue, { Prioritized } from './PriorityTaskQueue';

declare const require: any;

interface Task extends Prioritized {
  id: number;
  type: string;
  payload: any;
  resolve: (value: any) => void;
  reject: (err: Error) => void;
}

interface WorkerPoolOptions {
  size: number;
  maxQueueSize?: number;
  onBackpressure?: () => void;
}

type WorkerType = any;

export default class WorkerPool {
  private workers: WorkerType[] = [];

  private busy: Map<WorkerType, Task> = new Map();

  private queue = new PriorityTaskQueue<Task>();

  private nextId = 0;

  private maxQueueSize: number;

  private onBackpressure?: () => void;

  constructor(options: WorkerPoolOptions) {
    this.maxQueueSize = options.maxQueueSize ?? Infinity;
    this.onBackpressure = options.onBackpressure;

    for (let i = 0; i < options.size; i += 1) {
      const worker = this.createWorker();
      this.bindWorker(worker);
      this.workers.push(worker);
    }
  }

  private createWorker(): WorkerType {
    if (typeof window === 'undefined') {
      const path = require('path');
      const { Worker } = require('worker_threads');
      return new Worker(path.resolve(__dirname, './task.worker.ts'), {
        execArgv: ['-r', 'ts-node/register'],
      });
    }

    return new Worker('./task.worker.ts');
  }

  private bindWorker(worker: WorkerType): void {
    const handle = (msg: any) => {
      const task = this.busy.get(worker);
      if (!task) return;
      const { id, result, error } = msg;
      if (task.id === id) {
        if (error) task.reject(new Error(error));
        else task.resolve(result);
        this.busy.delete(worker);
        this.runNext();
      }
    };

    if (typeof worker.on === 'function') {
      worker.on('message', handle);
      worker.on('error', (err: any) => {
        const task = this.busy.get(worker);
        if (task) task.reject(err);
        this.busy.delete(worker);
        this.runNext();
      });
    } else {
      const webWorker = worker as any;
      webWorker.onmessage = (e: any) => handle(e.data);
      webWorker.onerror = (err: any) => {
        const task = this.busy.get(worker);
        if (task) task.reject(err as Error);
        this.busy.delete(worker);
        this.runNext();
      };
    }
  }

  runTask(type: string, payload: any, priority = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nextId += 1;
      const task: Task = {
        id: this.nextId,
        type,
        payload,
        priority,
        resolve,
        reject,
      };
      this.queue.enqueue(task);
      if (this.queue.length > this.maxQueueSize) {
        this.onBackpressure?.();
      }
      this.runNext();
    });
  }

  private runNext(): void {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const worker = this.workers.find((w) => !this.busy.has(w));
      if (!worker) break;
      const task = this.queue.dequeue();
      if (!task) break;
      this.busy.set(worker, task);
      worker.postMessage({ id: task.id, type: task.type, payload: task.payload });
    }
  }

  terminate(): void {
    this.workers.forEach((worker) => {
      if (typeof worker.terminate === 'function') {
        worker.terminate();
      }
    });
    this.workers = [];
  }
}
