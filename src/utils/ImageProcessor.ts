export interface ProcessOptions {
  maxWidth: number;
  maxHeight: number;
  maxSize: number;
  ssimThreshold: number;
  type: 'image/webp' | 'image/avif';
}

export function processImage(file: File, options: ProcessOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./imageWorker.ts', import.meta.url));
    worker.onmessage = (ev: MessageEvent) => {
      worker.terminate();
      resolve(ev.data as Blob);
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };
    worker.postMessage({ file, ...options });
  });
}
