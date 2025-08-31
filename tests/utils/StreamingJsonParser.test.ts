import StreamingJsonParser from '../../src/utils/StreamingJsonParser';

class MockReadableStream {
  private chunks: Uint8Array[];

  private delay: number;

  constructor(chunks: Uint8Array[], delay = 0) {
    this.chunks = chunks;
    this.delay = delay;
  }

  getReader() {
    let index = 0;
    const { chunks, delay } = this;
    return {
      read: () => new Promise<{ value?: Uint8Array; done: boolean }>((resolve) => {
        if (index >= chunks.length) {
          resolve({ value: undefined, done: true });
          return;
        }
        const value = chunks[index++];
        if (delay) {
          setTimeout(() => resolve({ value, done: false }), delay);
        } else {
          resolve({ value, done: false });
        }
      }),
      cancel: () => Promise.resolve(),
    };
  }
}

describe('StreamingJsonParser', () => {
  it('parses ndjson stream', async () => {
    const stream = new MockReadableStream([
      new TextEncoder().encode('{"a":1}\n'),
      new TextEncoder().encode('{"a":2}\n'),
      new TextEncoder().encode('{"a":3}\n'),
    ]) as unknown as ReadableStream<Uint8Array>;
    const values: any[] = [];
    await StreamingJsonParser.parse(stream, (v) => values.push(v));
    expect(values).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it('aborts parsing when signal triggers', async () => {
    const controller = new AbortController();
    const stream = new MockReadableStream([
      new TextEncoder().encode('{"a":1}\n'),
      new TextEncoder().encode('{"a":2}\n'),
    ], 5) as unknown as ReadableStream<Uint8Array>;
    const values: any[] = [];
    const promise = StreamingJsonParser.parse(stream, (v) => {
      values.push(v);
      controller.abort();
    }, controller.signal);
    await expect(promise).rejects.toThrow('Aborted');
    expect(values).toEqual([{ a: 1 }]);
  });
});
