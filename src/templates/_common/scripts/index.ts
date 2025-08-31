(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const initProgress = () => {
    const container = document.createElement('div');
    const progress = document.createElement('progress');
    progress.max = 100;
    progress.value = 0;

    const pause = document.createElement('button');
    pause.textContent = 'Pause';
    const resume = document.createElement('button');
    resume.textContent = 'Resume';
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';

    const consoleEl = document.createElement('pre');
    consoleEl.id = 'console';

    container.appendChild(progress);
    container.appendChild(pause);
    container.appendChild(resume);
    container.appendChild(cancel);
    container.appendChild(consoleEl);
    document.body.appendChild(container);

    let source: EventSource | null = null;
    let paused = false;

    const connect = () => {
      source = new EventSource('/api/progress');
      source.onmessage = (e) => {
        if (paused) return;
        const val = Number(e.data);
        if (!Number.isNaN(val)) {
          progress.value = val;
        }
        consoleEl.textContent += `${e.data}\n`;
      };
      source.addEventListener('heartbeat', () => {
        // keep connection alive
      });
      source.onerror = () => {
        consoleEl.textContent += '\n[connection lost, retrying]\n';
      };
    };

    connect();

    pause.addEventListener('click', () => {
      paused = true;
    });
    resume.addEventListener('click', () => {
      if (!source) {
        connect();
      }
      paused = false;
    });
    cancel.addEventListener('click', () => {
      source?.close();
      source = null;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgress);
  } else {
    initProgress();
  }
})();
