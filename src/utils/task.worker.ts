/* eslint-disable no-restricted-globals */
let post: (msg: any) => void;

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function handle(message: any): void {
  const { id, type, payload } = message;
  try {
    let result: any;
    switch (type) {
      case 'parse':
        result = JSON.parse(payload);
        break;
      case 'encode':
        if (typeof Buffer !== 'undefined') {
          result = Buffer.from(payload).toString('base64');
        } else {
          // @ts-ignore
          result = btoa(payload);
        }
        break;
      case 'heavy':
        result = fibonacci(payload);
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    post({ id, result });
  } catch (e) {
    post({ id, error: (e as Error).message });
  }
}

// Determine environment
if (typeof self !== 'undefined' && typeof (self as any).postMessage === 'function') {
  (self as any).onmessage = (e: MessageEvent) => handle(e.data);
  post = (msg) => (self as any).postMessage(msg);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { parentPort } = require('worker_threads');
  parentPort.on('message', handle);
  post = (msg) => parentPort.postMessage(msg);
}
