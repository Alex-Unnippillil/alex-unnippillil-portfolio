import RequestQueue from '../../src/utils/RequestQueue';

describe('RequestQueue', () => {
  it('limits concurrent requests per endpoint', async () => {
    const queue = new RequestQueue();
    queue.setConcurrency('test', 1);

    const order: string[] = [];
    let running = 0;

    const makeTask = (id: number) => queue.enqueue('test', async () => {
      order.push(`start${id}`);
      running += 1;
      expect(running).toBe(1);
      await new Promise((r) => setTimeout(r, 5));
      running -= 1;
      order.push(`end${id}`);
    });

    await Promise.all([makeTask(1), makeTask(2), makeTask(3)]);
    expect(order).toEqual(['start1', 'end1', 'start2', 'end2', 'start3', 'end3']);
  });
});
