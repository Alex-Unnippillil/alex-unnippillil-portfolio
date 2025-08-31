const perf = (typeof performance === 'undefined'
  ? require('perf_hooks').performance
  : performance);

export function markStart(name: string): void {
  perf.mark(`${name}-start`);
}

export function markEnd(name: string): number {
  const endMark = `${name}-end`;
  perf.mark(endMark);
  const measureName = `${name}-measure`;
  perf.measure(measureName, `${name}-start`, endMark);
  const [measure] = perf.getEntriesByName(measureName);
  perf.clearMarks(`${name}-start`);
  perf.clearMarks(endMark);
  perf.clearMeasures(measureName);
  return measure?.duration ?? 0;
}

export default { markStart, markEnd };
