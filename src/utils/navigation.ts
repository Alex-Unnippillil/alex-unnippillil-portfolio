/*
 * Navigation utilities to provide loading feedback, transitions and
 * cancellation of outdated requests.
 */

let currentController: AbortController | null = null;
let delayHandle: ReturnType<typeof setTimeout> | null = null;

function createLoadingBar(): HTMLDivElement {
  const bar = document.createElement('div');
  bar.id = 'top-loading-bar';
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '3px',
    width: '0%',
    backgroundColor: '#29d',
    transition: 'width 0.2s ease',
    zIndex: '9999',
    display: 'none',
  });
  document.body.appendChild(bar);
  return bar;
}

function startLoadingBar(bar: HTMLDivElement): void {
  delayHandle = setTimeout(() => {
    bar.style.display = 'block';
    requestAnimationFrame(() => {
      bar.style.width = '80%';
    });
  }, 100);
}

function stopLoadingBar(bar: HTMLDivElement): void {
  if (delayHandle) {
    clearTimeout(delayHandle);
    delayHandle = null;
  }
  bar.style.width = '100%';
  setTimeout(() => {
    bar.style.display = 'none';
    bar.style.width = '0%';
  }, 200);
}

function viewTransition(cb: () => void | Promise<void>): Promise<void> {
  const anyDocument = document as any;
  if (typeof anyDocument.startViewTransition === 'function') {
    return anyDocument.startViewTransition(cb).finished;
  }
  const result = cb();
  return Promise.resolve(result);
}

async function handleNavigate(url: string, bar: HTMLDivElement): Promise<void> {
  currentController?.abort();
  currentController = new AbortController();
  startLoadingBar(bar);
  try {
    const response = await fetch(url, { signal: currentController.signal });
    const html = await response.text();
    await viewTransition(() => {
      document.body.innerHTML = html;
    });
  } catch (e) {
    if ((e as any).name !== 'AbortError') {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  } finally {
    stopLoadingBar(bar);
  }
}

export default function initNavigation(): void {
  const bar = createLoadingBar();
  if ('navigation' in window) {
    (window as any).navigation.addEventListener('navigate', (event: any) => {
      const { url } = event.destination;
      event.intercept({
        handler: () => handleNavigate(url, bar),
      });
    });
  }
}
