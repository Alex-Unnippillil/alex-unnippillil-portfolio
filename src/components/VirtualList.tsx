import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Debounce helper without external dependencies.
 */
function useDebouncedCallback(callback: () => void, delay: number) {
  const timer = useRef<number>();
  return useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(callback, delay);
  }, [callback, delay]);
}

export interface VirtualListProps<T> {
  /** Data items to render */
  items: T[];
  /** Render function for a single item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Estimated height for each row before measurement */
  estimatedRowHeight: number;
  /** Number of extra rows to render beyond the visible area */
  overscan?: number;
  /** Number of columns for grid layout. Defaults to 1 (list). */
  columnCount?: number;
  /** Optional class name for the outer element */
  className?: string;
  /** Delay for height reflow debounce */
  reflowDebounce?: number;
}

/**
 * Generic virtualized list/grid component using windowing.
 * Supports dynamic row heights and keyboard accessibility.
 */
export default function VirtualList<T>(props: VirtualListProps<T>) {
  const {
    items,
    renderItem,
    estimatedRowHeight,
    overscan = 2,
    columnCount = 1,
    className,
    reflowDebounce = 50,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const rowCount = Math.ceil(items.length / columnCount);

  // Store row heights in a ref to avoid triggering renders on every measure.
  const rowHeightsRef = useRef<number[]>(
    new Array(rowCount).fill(estimatedRowHeight),
  );
  const observersRef = useRef<Map<number, ResizeObserver>>(new Map());
  const [version, setVersion] = useState(0); // increments to signal height changes

  const triggerReflow = useDebouncedCallback(() => {
    // Trigger re-render after measurements settle
    setVersion((v) => v + 1);
  }, reflowDebounce);

  // Cleanup observers on unmount
  useEffect(() => () => {
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current.clear();
  }, []);

  const handleScroll = useCallback<React.UIEventHandler<HTMLDivElement>>((e) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    setViewportHeight(target.clientHeight);
  }, []);

  const handleKeyDown = useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
    (e) => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const page = el.clientHeight;
      switch (e.key) {
        case 'PageDown':
          e.preventDefault();
          el.scrollBy(0, page);
          break;
        case 'PageUp':
          e.preventDefault();
          el.scrollBy(0, -page);
          break;
        case 'Home':
          e.preventDefault();
          el.scrollTo(0, 0);
          break;
        case 'End':
          e.preventDefault();
          el.scrollTo(0, el.scrollHeight);
          break;
        default:
      }
    },
    [],
  );

  // Jump to index accessibility input
  const [jumpIndex, setJumpIndex] = useState('');
  const handleJumpSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const idx = Number(jumpIndex);
      if (Number.isNaN(idx)) return;
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      const row = Math.floor(clamped / columnCount);
      const top = rowHeightsRef.current
        .slice(0, row)
        .reduce((a, b) => a + b, 0);
      if (containerRef.current) {
        containerRef.current.scrollTop = top;
      }
    },
    [jumpIndex, items.length, columnCount],
  );

  // Recompute prefix sums when heights change
  const prefixSums = useMemo(() => {
    const sums: number[] = [0];
    const heights = rowHeightsRef.current;
    for (let i = 0; i < rowCount; i += 1) {
      sums[i + 1] = sums[i] + heights[i];
    }
    return sums;
  }, [version, rowCount]);

  const totalHeight = prefixSums[prefixSums.length - 1];

  const findRow = useCallback(
    (offset: number) => {
      let low = 0;
      let high = rowCount - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (prefixSums[mid + 1] > offset) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      return Math.min(low, rowCount - 1);
    },
    [prefixSums, rowCount],
  );

  const startRow = Math.max(0, findRow(scrollTop) - overscan);
  const endRow = Math.min(
    rowCount - 1,
    findRow(scrollTop + viewportHeight) + overscan,
  );

  const topPad = prefixSums[startRow];
  const bottomPad = totalHeight - prefixSums[endRow + 1];

  const measureRow = useCallback(
    (row: number, node: HTMLDivElement | null) => {
      const map = observersRef.current;
      const prev = map.get(row);
      if (prev) {
        prev.disconnect();
        map.delete(row);
      }
      if (node) {
        if (typeof ResizeObserver !== 'undefined') {
          const obs = new ResizeObserver((entries) => {
            const h = entries[0].contentRect.height;
            if (rowHeightsRef.current[row] !== h) {
              rowHeightsRef.current[row] = h;
              triggerReflow();
            }
          });
          obs.observe(node);
          map.set(row, obs);
        } else {
          const h = node.getBoundingClientRect().height;
          if (rowHeightsRef.current[row] !== h) {
            rowHeightsRef.current[row] = h;
            triggerReflow();
          }
        }
      }
    },
    [triggerReflow],
  );

  const rows: React.ReactNode[] = [];
  for (let r = startRow; r <= endRow; r += 1) {
    const cells: React.ReactNode[] = [];
    const base = r * columnCount;
    for (let c = 0; c < columnCount; c += 1) {
      const index = base + c;
      if (index >= items.length) break;
      cells.push(
        <div key={index} style={{ flex: 1 }}>
          {renderItem(items[index], index)}
        </div>,
      );
    }
    rows.push(
      <div
        key={r}
        ref={(el) => measureRow(r, el)}
        style={{ display: columnCount > 1 ? 'flex' : 'block' }}
      >
        {cells}
      </div>,
    );
  }

  useEffect(() => {
    if (containerRef.current) {
      setViewportHeight(containerRef.current.clientHeight);
    }
  }, []);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <form onSubmit={handleJumpSubmit} style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="jumpToIndex">
          Jump to index:
          <input
            id="jumpToIndex"
            type="number"
            value={jumpIndex}
            onChange={(e) => setJumpIndex(e.target.value)}
            aria-label="Jump to index"
            style={{ marginLeft: '0.25rem' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '0.5rem' }}>
          Go
        </button>
      </form>
      <div
        ref={containerRef}
        style={{ overflow: 'auto', flex: '1 1 auto', outline: 'none' }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div style={{ height: topPad }} />
        {rows}
        <div style={{ height: bottomPad }} />
      </div>
    </div>
  );
}
