import { markStart, markEnd } from '../../src/utils/performance';

describe('performance utils', () => {
  it('measures duration', () => {
    markStart('test');
    const duration = markEnd('test');
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});
