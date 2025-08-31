(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  interface Shortcut {
    keys: string;
    description: string;
    handler: () => void;
  }

  const shortcuts: Shortcut[] = [];
  let palette: HTMLDivElement | null = null;

  function renderList(filter: string): void {
    if (!palette) return;
    const list = palette.querySelector('ul');
    if (!list) return;
    list.innerHTML = '';
    const q = filter.toLowerCase();
    shortcuts
      .filter((s) => s.description.toLowerCase().indexOf(q) !== -1)
      .forEach((s) => {
        const li = document.createElement('li');
        li.textContent = `${s.keys} \u2013 ${s.description}`;
        list.appendChild(li);
      });
  }

  function closePalette(): void {
    if (palette) {
      palette.style.display = 'none';
    }
  }

  function createPalette(): void {
    palette = document.createElement('div');
    palette.id = 'shortcut-palette';
    palette.style.position = 'fixed';
    palette.style.top = '0';
    palette.style.left = '0';
    palette.style.right = '0';
    palette.style.bottom = '0';
    palette.style.background = 'rgba(0, 0, 0, 0.6)';
    palette.style.display = 'none';
    palette.style.zIndex = '9999';
    palette.style.alignItems = 'flex-start';
    palette.style.justifyContent = 'center';
    palette.style.paddingTop = '10vh';

    const box = document.createElement('div');
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    box.style.background = isDark ? '#1e1e1e' : '#ffffff';
    box.style.color = isDark ? '#ffffff' : '#000000';
    box.style.minWidth = '300px';
    box.style.maxWidth = '600px';
    box.style.width = '80%';
    box.style.borderRadius = '4px';
    box.style.padding = '16px';
    box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.4)';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search shortcuts…';
    input.style.width = '100%';
    input.style.marginBottom = '8px';
    input.style.outline = '2px solid currentColor';
    input.addEventListener('input', () => {
      renderList(input.value);
    });

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePalette();
      }
    });

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    box.appendChild(input);
    box.appendChild(list);
    palette.appendChild(box);
    document.body.appendChild(palette);

    palette.addEventListener('click', (e) => {
      if (e.target === palette) {
        closePalette();
      }
    });
  }

  function openPalette(): void {
    if (!palette) {
      createPalette();
    }
    const input = palette!.querySelector('input') as HTMLInputElement;
    palette!.style.display = 'flex';
    input.value = '';
    renderList('');
    input.focus();
  }

  function registerShortcut(shortcut: Shortcut): void {
    shortcuts.push(shortcut);
  }

  registerShortcut({
    keys: '?',
    description: 'Show shortcut palette',
    handler: openPalette,
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target
      && (target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.tagName === 'SELECT'
        || target.isContentEditable)
    ) {
      return;
    }

    if (!document.hasFocus()) {
      return;
    }

    if (palette && palette.style.display !== 'none' && e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }

    const { key } = e;
    if (key === '?' || (key === '/' && e.shiftKey)) {
      e.preventDefault();
      openPalette();
      return;
    }

    shortcuts.forEach((s) => {
      if (s.keys === key) {
        s.handler();
      }
    });
  });
})();
