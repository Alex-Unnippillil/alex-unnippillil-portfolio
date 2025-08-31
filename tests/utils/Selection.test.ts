import { performance } from 'perf_hooks';
import selectRange from '../../src/utils/selection';

describe('selection utils', () => {
  it('selectRange handles large selections efficiently', () => {
    const items = Array.from({ length: 10000 }, (_, i) => i);
    const start = performance.now();
    const result = selectRange(items, 100, 9900);
    const duration = performance.now() - start;
    expect(result.length).toBe(9801);
    expect(duration).toBeLessThan(50);
  });
});
