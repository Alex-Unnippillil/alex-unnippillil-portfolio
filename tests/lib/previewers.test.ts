import { getPreviewer } from '../../src/lib/previewers';
import { streamText } from '../../src/lib/previewers/text';
import { isSafeMimeType } from '../../src/lib/previewSecurity';

const encoder = new TextEncoder();

class SimpleReadableStream {
  private chunks: Uint8Array[];

  constructor(chunks: Uint8Array[]) {
    this.chunks = chunks;
  }

  getReader() {
    let index = 0;
    return {
      read: async () => {
        if (index < this.chunks.length) {
          const value = this.chunks[index];
          index += 1;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

function makeBlob(content: string): Blob {
  const chunk = encoder.encode(content);
  return {
    text: async () => content,
    stream: () => new SimpleReadableStream([chunk]),
  } as unknown as Blob;
}

function makeChunkedBlob(chunks: string[]): Blob {
  const encoded = chunks.map((c) => encoder.encode(c));
  return {
    text: async () => chunks.join(''),
    stream: () => new SimpleReadableStream(encoded),
  } as unknown as Blob;
}

(global as any).URL = {
  createObjectURL: () => 'blob:mock',
};

describe('Previewers', () => {
  it('streams text in chunks', async () => {
    const stream = new SimpleReadableStream([
      encoder.encode('hello '),
      encoder.encode('world'),
    ]) as unknown as ReadableStream<Uint8Array>;

    const chunks: string[] = [];
    await streamText(stream, (chunk) => chunks.push(chunk));
    expect(chunks).toStrictEqual(['hello ', 'world']);
  });

  it('previews images', async () => {
    const previewer = getPreviewer('image/png');
    expect(previewer).not.toBeNull();
    const url = await previewer!(makeBlob(''));
    expect(typeof url).toBe('string');
    expect(url.startsWith('blob:')).toBe(true);
  });

  it('previews json', async () => {
    const previewer = getPreviewer('application/json');
    expect(previewer).not.toBeNull();
    const blob = makeBlob('{"a":1}');
    const text = await previewer!(blob);
    const expected = `{
  "a": 1
}`;
    expect(text).toBe(expected);
  });

  it('previews text using chunks', async () => {
    const previewer = getPreviewer('text/plain');
    expect(previewer).not.toBeNull();
    const blob = makeChunkedBlob(['chunked ', 'text']);
    const chunks: string[] = [];
    await previewer!(blob, (chunk) => chunks.push(chunk));
    expect(chunks.join('')).toBe('chunked text');
  });

  it('blocks unsafe types', async () => {
    expect(isSafeMimeType('application/javascript')).toBe(false);
    const previewer = getPreviewer('application/javascript');
    expect(previewer).not.toBeNull();
    const onChunk = jest.fn();
    const message = await previewer!(makeBlob('console.log(1)'), onChunk);
    expect(message).toMatch(/blocked/);
    expect(onChunk).not.toHaveBeenCalled();
  });
});
