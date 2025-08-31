import HistoryManager from '../../src/lib/history';

describe('HistoryManager', () => {
  it('supports multi-step undo', () => {
    const history = new HistoryManager();
    const order: number[] = [];

    history.push({ description: 'one', rollback: () => order.push(1) });
    history.push({ description: 'two', rollback: () => order.push(2) });
    history.push({ description: 'three', rollback: () => order.push(3) });

    const undone = history.undo(2);

    expect(order).toStrictEqual([3, 2]);
    expect(undone.map((u) => u.description)).toStrictEqual(['three', 'two']);

    expect(history.canUndo()).toBe(true);
    history.undo();
    expect(order).toStrictEqual([3, 2, 1]);
    expect(history.canUndo()).toBe(false);
  });
});
