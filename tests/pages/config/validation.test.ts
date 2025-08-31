import clampAndRound from '../../../src/pages/config/utils/validation';

describe('clampAndRound', () => {
  it('rounds to nearest integer', () => {
    expect(clampAndRound(1.4)).toBe(1);
    expect(clampAndRound(1.5)).toBe(2);
  });

  it('clamps between min and max', () => {
    expect(clampAndRound(5, 1, 3)).toBe(3);
    expect(clampAndRound(-1, 0, 10)).toBe(0);
  });
});
