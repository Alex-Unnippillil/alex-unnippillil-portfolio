import WorkerPool from '../../src/utils/WorkerPool';

describe('WorkerPool', () => {
  it('processes tasks in priority order', async () => {
    const pool = new WorkerPool({ size: 1 });
    const order: string[] = [];
    const t1 = pool.runTask('heavy', 20, 1).then(() => order.push('low'));
    const t2 = pool.runTask('parse', '"{}"', 10).then(() => order.push('high'));
    const t3 = pool.runTask('encode', 'data', 5).then(() => order.push('medium'));
    await Promise.all([t1, t2, t3]);
    expect(order).toEqual(['low', 'high', 'medium']);
    pool.terminate();
  });

  it('signals backpressure when queue saturated', async () => {
    const onBackpressure = jest.fn();
    const pool = new WorkerPool({ size: 1, maxQueueSize: 1, onBackpressure });
    pool.runTask('parse', '"1"');
    pool.runTask('parse', '"2"');
    pool.runTask('parse', '"3"');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(onBackpressure).toHaveBeenCalled();
    pool.terminate();
  });

  it('executes heavy tasks without blocking main thread', async () => {
    const pool = new WorkerPool({ size: 1 });
    let flag = false;
    const heavy = pool.runTask('heavy', 35);
    setTimeout(() => { flag = true; }, 0);
    await heavy;
    expect(flag).toBe(true);
    pool.terminate();
  });
});
