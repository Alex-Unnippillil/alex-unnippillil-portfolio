/**
 * @jest-environment jsdom
 */

import TimeSync from '../../src/utils/TimeSync';
import { getCountdownRemaining, isTokenExpired } from '../../src/utils/TimeUtils';

describe('TimeSync utilities', () => {
  beforeEach(() => {
    TimeSync.skew = 0;
    TimeSync.maxSkew = 5 * 60 * 1000;
    document.body.innerHTML = '';
  });

  it('adjusts now using skew', () => {
    TimeSync.skew = 2000;
    const diff = TimeSync.now() - Date.now();
    expect(diff).toBeGreaterThanOrEqual(2000);
  });

  it('calculates token expiry with skew', () => {
    TimeSync.skew = 10000;
    const expiry = Date.now() + 5000;
    expect(isTokenExpired(expiry)).toBe(true);
  });

  it('calculates countdowns with skew', () => {
    TimeSync.skew = -5000;
    const target = Date.now() + 10000;
    const remaining = getCountdownRemaining(target);
    expect(remaining).toBeGreaterThan(10000);
  });

  it('shows warning when skew exceeds safe window', () => {
    TimeSync.maxSkew = 1000;
    TimeSync.skew = 5000;
    TimeSync.warnIfSkewed();
    expect(document.getElementById('time-skew-warning')).not.toBeNull();
  });
});

