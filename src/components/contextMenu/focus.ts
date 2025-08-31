let lastFocused: HTMLElement | null = null;

export function saveFocus(el: HTMLElement) {
  lastFocused = el;
}

export function restoreFocus() {
  if (lastFocused) {
    lastFocused.focus();
    lastFocused = null;
  }
}

export default { saveFocus, restoreFocus };
