import DeleteManager from '../../src/utils/DeleteManager';

jest.useFakeTimers();

describe('DeleteManager', () => {
  it('executes delete after delay', async () => {
    const fn = jest.fn();
    const op = DeleteManager.schedule(fn, { delayMs: 1000 });
    jest.advanceTimersByTime(1000);
    await op.promise;
    expect(fn).toHaveBeenCalled();
  });

  it('can undo before delay', () => {
    const fn = jest.fn();
    const op = DeleteManager.schedule(fn, { delayMs: 1000 });
    op.undo();
    jest.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });
});
