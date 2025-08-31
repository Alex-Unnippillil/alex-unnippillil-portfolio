import { calculateVisibleRange } from '../../src/modules/gallery/VirtualizedGrid';

describe('VirtualizedGrid', () => {
  it('calculates visible range at top', () => {
    const range = calculateVisibleRange({
      scrollTop: 0,
      containerHeight: 500,
      thumbHeight: 100,
      buffer: 1,
      imagesLength: 1000,
      perRow: 5,
    });
    expect(range).toStrictEqual({ start: 0, end: 30 });
  });

  it('calculates visible range in middle', () => {
    const range = calculateVisibleRange({
      scrollTop: 1000,
      containerHeight: 500,
      thumbHeight: 100,
      buffer: 1,
      imagesLength: 1000,
      perRow: 5,
    });
    expect(range).toStrictEqual({ start: 45, end: 80 });
  });
});
