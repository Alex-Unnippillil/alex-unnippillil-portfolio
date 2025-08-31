/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
function loadHighlightJs(): Promise<any> {
  return new Promise((resolve) => {
    const w = window as any;
    if (w.hljs) {
      resolve(w.hljs);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js';
    script.addEventListener('load', () => resolve(w.hljs));
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css';
    document.head.appendChild(link);
  });
}

function buildLines(html: string): string {
  return html
    .trimEnd()
    .split('\n')
    .map((line) => `<span class="code-block__line">${line || '&nbsp;'}</span>`)
    .join('\n');
}

function enhanceBlock(hljs: any, code: HTMLElement): void {
  const pre = code.parentElement as HTMLElement;
  if (!pre) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block code-block--numbered';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const toolbar = document.createElement('div');
  toolbar.className = 'code-block__toolbar';
  wrapper.insertBefore(toolbar, pre);

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'code-block__copy';
  copyBtn.textContent = 'Copy';
  toolbar.appendChild(copyBtn);

  const linesBtn = document.createElement('button');
  linesBtn.type = 'button';
  linesBtn.className = 'code-block__lines-toggle';
  linesBtn.textContent = 'Line numbers';
  toolbar.appendChild(linesBtn);

  const toast = document.createElement('div');
  toast.className = 'code-block__toast';
  toast.textContent = 'Copied!';
  wrapper.appendChild(toast);

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(code.textContent || '');
    toast.classList.add('code-block__toast--visible');
    setTimeout(() => toast.classList.remove('code-block__toast--visible'), 2000);
  });

  linesBtn.addEventListener('click', () => {
    wrapper.classList.toggle('code-block--numbered');
  });

  const override = code.dataset.language || (code.className.match(/language-(\w+)/) || [])[1];
  const source = code.textContent || '';
  const result = override
    ? hljs.highlight(source, { language: override })
    : hljs.highlightAuto(source);

  code.innerHTML = buildLines(result.value);

  if (result.language) {
    code.classList.add(`language-${result.language}`);
    pre.setAttribute('data-language', result.language);
  }

  pre.classList.add('code-block__pre');
  pre.setAttribute('tabindex', '0');
  pre.setAttribute('role', 'region');
  pre.setAttribute('aria-label', `Code block${result.language ? ` (${result.language})` : ''}`);
}

document.addEventListener('DOMContentLoaded', () => {
  loadHighlightJs().then((hljs) => {
    document.querySelectorAll<HTMLElement>('pre code').forEach((block) => {
      enhanceBlock(hljs, block);
    });
  });
});

export {};
