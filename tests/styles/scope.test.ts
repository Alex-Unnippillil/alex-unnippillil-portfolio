/**
 * @jest-environment jsdom
 */

import { createScopedStyle } from '../../src/styles/scoping';

describe('CSS scoping', () => {
  it('isolates styles between themes', () => {
    document.head.appendChild(createScopedStyle('theme-a', '.btn { color: red; }'));
    document.head.appendChild(createScopedStyle('theme-b', '.btn { color: blue; }'));

    const aWrap = document.createElement('div');
    aWrap.className = 'theme-a';
    const a = document.createElement('div');
    a.className = 'btn';
    aWrap.appendChild(a);

    const bWrap = document.createElement('div');
    bWrap.className = 'theme-b';
    const b = document.createElement('div');
    b.className = 'btn';
    bWrap.appendChild(b);

    document.body.appendChild(aWrap);
    document.body.appendChild(bWrap);

    expect(getComputedStyle(a).color).toBe('red');
    expect(getComputedStyle(b).color).toBe('blue');
  });
});
