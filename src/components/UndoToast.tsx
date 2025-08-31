export interface UndoToastOptions {
  /** Text describing the action that occurred */
  action: string;
  /**
   * How long the toast should remain on screen before automatically
   * disappearing, in milliseconds. A countdown is shown to the user
   * indicating how long they have left to undo.
   */
  duration?: number;
  /** Callback invoked if the user presses the undo button */
  onUndo: () => void;
}

/**
 * Minimal toast implementation showing an undo option with a countdown.
 * The implementation does not rely on any UI library; instead it manipulates
 * the DOM directly so that it can be used in the existing code base without
 * additional dependencies.
 */
export function showUndoToast({ action, duration = 5000, onUndo }: UndoToastOptions): void {
  const container = document.createElement('div');
  container.className = 'undo-toast';

  const message = document.createElement('span');
  const countdown = document.createElement('span');
  const button = document.createElement('button');

  message.textContent = `${action}`;
  button.textContent = 'Undo';

  let remaining = Math.ceil(duration / 1000);
  countdown.textContent = ` (${remaining})`;

  container.appendChild(message);
  container.appendChild(countdown);
  container.appendChild(button);

  const remove = (): void => {
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
  };

  const timer = setInterval(() => {
    remaining -= 1;
    countdown.textContent = ` (${remaining})`;
    if (remaining <= 0) {
      clearInterval(timer);
      remove();
    }
  }, 1000);

  button.addEventListener('click', () => {
    clearInterval(timer);
    remove();
    onUndo();
  });

  document.body.appendChild(container);
}
