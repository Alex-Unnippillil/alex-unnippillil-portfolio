const { performance } = require('perf_hooks');

async function withMemoryLeakCheck(fn) {
  performance.mark('mem-start');
  const start = process.memoryUsage().heapUsed;
  const result = await fn();
  const end = process.memoryUsage().heapUsed;
  performance.mark('mem-end');
  performance.measure('memory-leak', 'mem-start', 'mem-end');
  const [measure] = performance.getEntriesByName('memory-leak');
  performance.clearMarks();
  performance.clearMeasures();
  return {
    result,
    leak: end - start,
    duration: measure.duration
  };
}

module.exports = { withMemoryLeakCheck };
