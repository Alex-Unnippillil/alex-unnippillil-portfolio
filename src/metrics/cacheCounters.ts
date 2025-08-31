interface Counter {
  hits: number;
  total: number;
}

const counters: Map<string, Counter> = new Map();

export function recordHit(path: string, hit: boolean): void {
  const counter = counters.get(path) || { hits: 0, total: 0 };
  counter.total += 1;
  if (hit) {
    counter.hits += 1;
  }
  counters.set(path, counter);
}

export function getHitRate(path: string): number {
  const counter = counters.get(path);
  if (!counter || counter.total === 0) {
    return 0;
  }
  return counter.hits / counter.total;
}

export function getCounters(): Record<string, Counter> {
  const result: Record<string, Counter> = {};
  counters.forEach((value, key) => {
    result[key] = { ...value };
  });
  return result;
}

export function resetCounters(): void {
  counters.clear();
}
