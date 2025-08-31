import { recordHit, getHitRate, resetCounters } from '../../src/metrics/cacheCounters';

describe('cacheCounters', () => {
  beforeEach(() => {
    resetCounters();
  });

  it('calculates hit rate per path', () => {
    recordHit('/foo', true);
    recordHit('/foo', false);
    recordHit('/foo', true);

    expect(getHitRate('/foo')).toBeCloseTo(2 / 3);
  });

  it('returns 0 for unknown paths', () => {
    expect(getHitRate('/unknown')).toBe(0);
  });
});
