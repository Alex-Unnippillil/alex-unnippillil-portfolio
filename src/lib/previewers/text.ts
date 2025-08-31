import { Previewer } from './index';

/**
 * Streams a text readable stream and emits decoded chunks through the
 * provided callback.
 */
export async function streamText(
  stream: ReadableStream<Uint8Array>,
  onChunk: (text: string) => void,
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }

  const remainder = decoder.decode();
  if (remainder) {
    onChunk(remainder);
  }
}

/**
 * Reads a text blob and streams its contents chunk by chunk.
 */
export const textPreviewer: Previewer = async (
  blob: Blob,
  onChunk?: (text: string) => void,
): Promise<void> => {
  const callback = onChunk || (() => {});
  await streamText(blob.stream(), callback);
};

export default textPreviewer;
