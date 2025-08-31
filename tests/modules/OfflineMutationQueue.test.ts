import OfflineMutationQueue, { InMemoryMutationStore, ConflictError, MutationRecord } from '../../src/modules/offline/OfflineMutationQueue';

describe('OfflineMutationQueue', () => {
  test('persist mutation in store', async () => {
    const store = new InMemoryMutationStore<any>();
    const queue = new OfflineMutationQueue(store, { baseDelay: 1 });
    await queue.enqueue({ foo: 'bar' });
    const all = await store.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].data).toEqual({ foo: 'bar' });
    expect(all[0].status).toBe('queued');
  });

  test('replay queued mutations with exponential backoff and status', async () => {
    const store = new InMemoryMutationStore<any>();
    const queue = new OfflineMutationQueue(store, { baseDelay: 1, maxDelay: 2 });
    const statuses: string[] = [];
    queue.on('status', (r: MutationRecord) => statuses.push(r.status));
    await queue.enqueue({ a: 1 });
    const processor = jest.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(undefined);
    await queue.process(processor);
    expect(processor).toHaveBeenCalledTimes(2);
    expect(statuses).toEqual(['queued', 'processing', 'error', 'processing', 'success']);
  });

  test('conflict diff with resolve actions', async () => {
    const store = new InMemoryMutationStore<any>();
    const queue = new OfflineMutationQueue(store, { baseDelay: 1 });
    await queue.enqueue({ a: 1 });
    const conflicts: any[] = [];
    queue.on('conflict', (e) => conflicts.push(e));
    const processor = jest.fn().mockImplementation(() => Promise.reject(new ConflictError({ a: 2 })));
    await queue.process(processor);
    expect(conflicts).toHaveLength(1);
    const event = conflicts[0];
    expect(event.diff.local).toContain('"a": 1');
    expect(event.diff.remote).toContain('"a": 2');
    await event.resolveWithServer();
    const remaining = await store.getAll();
    expect(remaining).toHaveLength(0);
  });
});
