import { TokenBucket } from '../../../src/pages/api/rateLimit';

describe('TokenBucket rate limiter', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('limits requests and refills tokens', () => {
    const limiter = new TokenBucket(2, 1000);
    expect(limiter.consume('ip')).toBe(true);
    expect(limiter.consume('ip')).toBe(true);
    expect(limiter.consume('ip')).toBe(false);
    jest.advanceTimersByTime(1000);
    expect(limiter.consume('ip')).toBe(true);
  });
});
