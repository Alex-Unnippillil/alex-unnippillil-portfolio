import DateUtils from '../../src/utils/DateUtils';

describe('DateUtils', () => {
  it('returns relative time', () => {
    const now = new Date('2020-01-02T00:00:00Z');
    const from = new Date('2020-01-01T00:00:00Z');
    expect(DateUtils.relativeTime(from, now)).toBe('1 day ago');
  });

  it('detects staleness based on threshold', () => {
    const now = new Date('2020-01-02T00:00:00Z');
    const from = new Date('2020-01-01T00:00:00Z');
    expect(DateUtils.isStale(from, 1000 * 60 * 60 * 12, now)).toBe(true);
    expect(DateUtils.isStale(from, 1000 * 60 * 60 * 24 * 3, now)).toBe(false);
  });
});
