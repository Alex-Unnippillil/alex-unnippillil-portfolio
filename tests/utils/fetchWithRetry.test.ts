import fetchWithRetry from '../../src/utils/fetchWithRetry';

declare const global: any;

describe('fetchWithRetry', () => {
  it('retries on failure', async () => {
    const fetchMock = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue({ ok: true } as Response);
    global.fetch = fetchMock;

    const res = await fetchWithRetry('http://example.com', { retries: 1, retryDelay: 1 });
    expect(res.ok).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
