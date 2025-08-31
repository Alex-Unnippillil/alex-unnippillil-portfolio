/** @jest-environment jsdom */

import UndoToast from '../../src/components/UndoToast';

describe('UndoToast component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('removes itself after the duration', () => {
    jest.useFakeTimers();
    new UndoToast({ onUndo: () => {}, message: 'Saved', duration: 100 });

    expect(document.querySelector('.undo-toast')).not.toBeNull();

    jest.advanceTimersByTime(150);

    expect(document.querySelector('.undo-toast')).toBeNull();
    jest.useRealTimers();
  });

  it('triggers undo callback when button clicked', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    new UndoToast({ onUndo: fn, message: 'Saved', duration: 1000 });

    const button = document.querySelector('.undo-toast button') as HTMLButtonElement;
    button.click();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.undo-toast')).toBeNull();
    jest.useRealTimers();
  });
});

