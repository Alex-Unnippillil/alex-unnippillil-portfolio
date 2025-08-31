import request from '../../../src/utils/network/request';

jest.useFakeTimers();

describe('request helper', () => {
  it('retries failed requests', async () => {
    let attempts = 0;
    const executor = jest.fn().mockImplementation(() => {
      attempts += 1;
      if (attempts < 2) {
        return Promise.reject(new Error('fail'));
      }
      return Promise.resolve('ok');
    });

    const result = await request(executor, { retries: 1 });
    expect(result).toBe('ok');
    expect(executor).toHaveBeenCalledTimes(2);
  });

  it('aborts after timeout', async () => {
    const executor = jest.fn().mockImplementation(
      (signal: AbortSignal) => new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
    );

    const promise = request(executor, { timeout: 10 });

    jest.advanceTimersByTime(20);

    await expect(promise).rejects.toThrow('aborted');
  });

  it('supports external abort', async () => {
    const controller = new AbortController();
    const executor = jest.fn().mockImplementation(
      (signal: AbortSignal) => new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
    );

    const promise = request(executor, { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toThrow('aborted');
  });
});
