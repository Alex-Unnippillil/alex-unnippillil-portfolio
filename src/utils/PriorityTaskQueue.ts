export interface Prioritized {
  priority: number;
}

export default class PriorityTaskQueue<T extends Prioritized> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get length(): number {
    return this.items.length;
  }
}
