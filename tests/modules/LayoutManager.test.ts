/** @jest-environment jsdom */
import LayoutManager from '../../src/modules/layout/LayoutManager';

describe('LayoutManager', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="win"></div>';
    localStorage.clear();
  });

  it('saves and restores layout per device', () => {
    const el = document.getElementById('win') as HTMLElement;
    const mgr = new LayoutManager(el, 'device1');
    mgr.applyPreset('left-half');

    // create new manager to restore
    const mgr2 = new LayoutManager(el, 'device1');
    const expectedWidth = `${window.innerWidth / 2}px`;
    expect(el.style.width).toBe(expectedWidth);
    expect(el.style.left).toBe('0px');
    expect(el.style.top).toBe('0px');
    expect(mgr2).toBeDefined();
  });
});
