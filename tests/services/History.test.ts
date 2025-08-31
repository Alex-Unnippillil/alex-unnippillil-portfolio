import { HistoryService } from '../../src/services/history';

describe('HistoryService', () => {
  it('records operations and undoes them in reverse order', async () => {
    const history = new HistoryService();
    const order: number[] = [];

    history.record(async () => { order.push(1); });
    history.record(async () => { order.push(2); });

    await history.undo();
    expect(order).toEqual([2]);

    await history.undo();
    expect(order).toEqual([2, 1]);
  });

  it('supports multi-step undo', async () => {
    const history = new HistoryService();
    const calls: number[] = [];

    history.record(() => { calls.push(1); });
    history.record(() => { calls.push(2); });
    history.record(() => { calls.push(3); });

    await history.undo(2);
    expect(calls).toEqual([3, 2]);
    expect(history.length).toBe(1);
  });
});

