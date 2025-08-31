/** @jest-environment jsdom */
import initAnchors from '../../src/templates/_common/scripts/anchors';

describe('anchors', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="header"></header>
      <main>
        <h2 id="target">Target</h2>
      </main>
    `;

    const header = document.querySelector('.header') as HTMLElement;
    header.getBoundingClientRect = () => ({
      width: 0,
      height: 50,
      top: 0,
      left: 0,
      right: 0,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const target = document.getElementById('target') as HTMLElement;
    target.getBoundingClientRect = () => ({
      width: 0,
      height: 0,
      top: 300,
      left: 0,
      right: 0,
      bottom: 300,
      x: 0,
      y: 300,
      toJSON: () => {},
    });

    window.matchMedia = jest.fn().mockReturnValue({ matches: false, addListener: jest.fn(), removeListener: jest.fn() });
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
    window.scrollTo = jest.fn();
    window.location.hash = '#target';
  });

  it('scrolls to hashed element with offset', () => {
    initAnchors();
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 250, behavior: 'smooth' });
  });
});
