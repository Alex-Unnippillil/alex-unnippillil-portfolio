(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const PROMPT_ID = 'copy-quote-btn';

  function getSelectionRange(): Range | null {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      return selection.getRangeAt(0);
    }

    return null;
  }

  function createPrompt(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.id = PROMPT_ID;
    btn.textContent = 'Copy link to quote';
    btn.style.position = 'absolute';
    btn.style.display = 'none';
    btn.style.zIndex = '1000';
    document.body.appendChild(btn);
    return btn;
  }

  const prompt = createPrompt();

  function hidePrompt(): void {
    prompt.style.display = 'none';
  }

  function showPrompt(rect: DOMRect): void {
    prompt.style.left = `${rect.left + window.scrollX}px`;
    prompt.style.top = `${rect.bottom + window.scrollY}px`;
    prompt.style.display = 'block';
  }

  function getAnchor(range: Range): HTMLElement | null {
    let el: Node | null = range.commonAncestorContainer;
    while (el && !(el instanceof HTMLElement)) {
      el = el.parentElement;
    }
    let element: HTMLElement | null = el;
    while (element && !element.id) {
      element = element.parentElement;
    }
    if (!element) {
      return null;
    }
    return element;
  }

  function ensureElementId(el: HTMLElement): string {
    const element = el;
    if (!element.id) {
      element.id = `q-${Math.random().toString(36).slice(2)}`;
    }
    return element.id;
  }

  function buildLink(range: Range, el: HTMLElement): string {
    const preRange = document.createRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + range.toString().length;
    const id = ensureElementId(el);
    const hash = `${id}:${start}:${end}`;
    return `${window.location.origin}${window.location.pathname}#${encodeURIComponent(hash)}`;
  }

  prompt.addEventListener('click', () => {
    const range = getSelectionRange();
    if (!range) {
      return;
    }
    const anchor = getAnchor(range);
    if (!anchor) {
      hidePrompt();
      return;
    }
    const link = buildLink(range, anchor);
    navigator.clipboard.writeText(link).finally(() => {
      hidePrompt();
    });
  });

  document.addEventListener('mouseup', () => {
    const range = getSelectionRange();
    if (range) {
      showPrompt(range.getBoundingClientRect());
    } else {
      hidePrompt();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      hidePrompt();
    }
  });

  function highlightFromHash(): void {
    const { hash } = window.location;
    if (!hash) {
      return;
    }
    const decoded = decodeURIComponent(hash.substring(1));
    const [id, startStr, endStr] = decoded.split(':');
    const start = Number(startStr);
    const end = Number(endStr);
    if (!id || Number.isNaN(start) || Number.isNaN(end)) {
      return;
    }
    const el = document.getElementById(id);
    if (!el || !el.textContent) {
      return;
    }
    const text = el.textContent;
    if (end > text.length || start < 0 || start >= end) {
      return;
    }
    const marked = `${text.slice(0, start)}<mark>${text.slice(start, end)}</mark>${text.slice(end)}`;
    el.innerHTML = marked;
    const mark = el.querySelector('mark');
    if (mark) {
      mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  window.addEventListener('DOMContentLoaded', highlightFromHash);
})();
