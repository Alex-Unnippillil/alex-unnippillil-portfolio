import PriorityTaskQueue from '../../src/utils/PriorityTaskQueue';

describe('PriorityTaskQueue', () => {
  it('dequeues items by priority', () => {
    const queue = new PriorityTaskQueue<{ priority: number; value: string }>();
    queue.enqueue({ priority: 1, value: 'low' });
    queue.enqueue({ priority: 10, value: 'high' });
    queue.enqueue({ priority: 5, value: 'medium' });
    expect(queue.dequeue()?.value).toBe('high');
    expect(queue.dequeue()?.value).toBe('medium');
    expect(queue.dequeue()?.value).toBe('low');
  });
});
