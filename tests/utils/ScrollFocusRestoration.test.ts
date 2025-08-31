/** @jest-environment jsdom */
import { setupScrollFocusRestoration } from '../../src/utils/ScrollFocusRestoration';

describe('ScrollFocusRestoration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.body.innerHTML = '';
  });

  it('saves and restores scroll position and focus', () => {
    const input = document.createElement('input');
    input.id = 'field';
    document.body.appendChild(input);
    input.focus();

    Object.defineProperty(window, 'scrollX', { configurable: true, value: 10, writable: true });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 20, writable: true });

    setupScrollFocusRestoration();

    window.dispatchEvent(new Event('pagehide'));

    Object.defineProperty(window, 'scrollTo', {
      value: (x: number, y: number) => {
        Object.defineProperty(window, 'scrollX', { configurable: true, value: x, writable: true });
        Object.defineProperty(window, 'scrollY', { configurable: true, value: y, writable: true });
      },
      configurable: true,
    });

    input.blur();
    Object.defineProperty(window, 'scrollX', { configurable: true, value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });

    window.dispatchEvent(new Event('pageshow'));

    expect(window.scrollX).toBe(10);
    expect(window.scrollY).toBe(20);
    expect(document.activeElement).toBe(input);
  });
});
