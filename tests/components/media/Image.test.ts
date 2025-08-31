/**
 * @jest-environment jsdom
 */
import { createImage } from '../../../src/components/media/Image';

describe('Image component', () => {
  it('uses low quality source on slow connection', () => {
    Object.defineProperty(navigator, 'connection', {
      value: { downlink: 0.5, rtt: 500, saveData: true },
      configurable: true,
    });

    const img = createImage({ src: 'high.png', lowQualitySrc: 'low.png' });
    expect(img.getAttribute('src')).toBe('low.png');
  });
});
