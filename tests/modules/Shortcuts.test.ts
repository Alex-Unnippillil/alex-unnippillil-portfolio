/** @jest-environment jsdom */
import { ShortcutManager } from '../../src/modules/shortcuts';

function press(key: string, options: any = {}): void {
  const event = new KeyboardEvent('keydown', { key, ...options });
  document.dispatchEvent(event);
}

describe('ShortcutManager', () => {
  it('detects sequences', () => {
    const manager = new ShortcutManager();
    const fn = jest.fn();
    manager.register('g h', fn);
    press('g');
    press('h');
    expect(fn).toHaveBeenCalled();
  });

  it('detects chords', () => {
    const manager = new ShortcutManager();
    const fn = jest.fn();
    manager.register('ctrl+k', fn);
    press('k', { ctrlKey: true });
    expect(fn).toHaveBeenCalled();
  });

  it('handles scoped vs global shortcuts', () => {
    const manager = new ShortcutManager();
    const globalFn = jest.fn();
    const scopedFn = jest.fn();
    manager.register('x', globalFn);
    manager.register('x', scopedFn, { scope: 'modal' });

    manager.setScope('modal');
    press('x');
    expect(globalFn).toHaveBeenCalled();
    expect(scopedFn).toHaveBeenCalled();

    globalFn.mockClear();
    scopedFn.mockClear();

    manager.clearScope();
    press('x');
    expect(globalFn).toHaveBeenCalled();
    expect(scopedFn).not.toHaveBeenCalled();
  });
});
