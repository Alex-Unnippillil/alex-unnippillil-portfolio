/**
 * A small toast notification presenting the user with the option to undo the
 * latest action.  The toast automatically disappears after a short period of
 * time unless the user clicks the **Undo** button.
 *
 * The implementation purposefully avoids any dependency on a specific UI
 * framework (React/Angular/etc.) so that it can be used in the vanilla JS
 * environment of this project as well as within tests running in JSDOM.
 */
export interface UndoToastOptions {
  /** Callback invoked when the user clicks the *Undo* button. */
  onUndo: () => void;
  /** Optional message displayed inside the toast. */
  message?: string;
  /**
   * How long the toast should remain visible in milliseconds.  Defaults to
   * `3000` (3 seconds).
   */
  duration?: number;
}

export default class UndoToast {
  private element: HTMLDivElement;

  private timer = 0;

  constructor(options: UndoToastOptions) {
    const { onUndo, message = 'Action completed', duration = 3000 } = options;

    // Create basic markup: <div class="undo-toast"><span/> <button/></div>
    const root = document.createElement('div');
    root.className = 'undo-toast';

    const span = document.createElement('span');
    span.textContent = message;
    root.appendChild(span);

    const btn = document.createElement('button');
    btn.textContent = 'Undo';
    btn.addEventListener('click', () => {
      this.hide();
      onUndo();
    });
    root.appendChild(btn);

    // Append to document body.
    document.body.appendChild(root);

    // Store and start auto-dismiss timer.
    this.element = root;
    this.timer = window.setTimeout(() => this.hide(), duration);
  }

  /**
   * Removes the toast from the DOM and clears any remaining timers.
   */
  hide(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }

    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }
}

