const TAB_ID_KEY = 'scroll-focus-tab-id';

function getTabId(): string {
  let id = sessionStorage.getItem(TAB_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem(TAB_ID_KEY, id);
  }
  return id;
}

function stateKey(path: string): string {
  return `${getTabId()}:${path}`;
}

export function setupScrollFocusRestoration(): void {
  try {
    window.history.scrollRestoration = 'manual';
  } catch (e) {
    // ignore
  }

  const saveState = (): void => {
    const active = document.activeElement as HTMLElement | null;
    const data = {
      x: window.scrollX,
      y: window.scrollY,
      focusId: active && active.id ? active.id : null,
    };
    try {
      sessionStorage.setItem(stateKey(window.location.pathname + window.location.search), JSON.stringify(data));
    } catch (e) {
      // ignore storage errors
    }
  };

  const restoreState = (): void => {
    const raw = sessionStorage.getItem(stateKey(window.location.pathname + window.location.search));
    if (!raw) return;
    try {
      const { x, y, focusId } = JSON.parse(raw);
      window.scrollTo(x || 0, y || 0);
      if (focusId) {
        const el = document.getElementById(focusId);
        if (el) {
          (el as HTMLElement).focus();
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  };

  window.addEventListener('pagehide', saveState);
  window.addEventListener('pageshow', restoreState);
}

export default { setupScrollFocusRestoration };
