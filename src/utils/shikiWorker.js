const { parentPort } = require('worker_threads');

(async () => {
  const { codeToHtml } = await import('shiki');
  parentPort.postMessage({ type: 'ready' });
  parentPort.on('message', async ({ code, lang }) => {
    const html = await codeToHtml(code, { lang, theme: 'nord' });
    parentPort.postMessage({ type: 'result', html });
  });
})();
