export default class StreamingJsonParser {
  public static async parse<T>(
    stream: ReadableStream<Uint8Array>,
    onValue: (value: T) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const abort = () => {
      reader.cancel();
    };

    if (signal) {
      if (signal.aborted) {
        abort();
        throw new Error('Aborted');
      }
      signal.addEventListener('abort', abort);
    }

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let index;
        while ((index = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, index).trim();
          buffer = buffer.slice(index + 1);
          if (line) {
            onValue(JSON.parse(line));
          }
        }
        if (signal?.aborted) {
          abort();
          throw new Error('Aborted');
        }
      }
      const remaining = buffer.trim();
      if (remaining) {
        onValue(JSON.parse(remaining));
      }
    } finally {
      if (signal) {
        signal.removeEventListener('abort', abort);
      }
    }
  }
}
