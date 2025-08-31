import { autoAdjust, meetsAA, ColorPair } from '../../src/utils/Contrast';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokens: { pairs: ColorPair[] } = require('../../data/design-tokens.json');

describe('design token contrast', () => {
  test('tokens meet AA contrast', () => {
    tokens.pairs.forEach((p: ColorPair) => {
      expect(meetsAA(p.foreground, p.background)).toBe(true);
    });
  });

  test('autoAdjust nudges color to AA', () => {
    const adjusted = autoAdjust('#777777', '#ffffff');
    expect(meetsAA(adjusted, '#ffffff')).toBe(true);
  });
});
