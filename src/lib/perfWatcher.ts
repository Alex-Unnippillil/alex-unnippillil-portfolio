export interface IPerfMetrics {
  longTaskDuration: number; // total duration in ms
  longTaskCount: number; // number of long tasks
  maxMemory: number; // max memory used in bytes
}

/**
 * PerformanceWatcher observes long tasks and samples memory usage
 * over time. It is intended to run in the browser where the
 * PerformanceObserver and performance.memory APIs are available.
 */
export default class PerformanceWatcher {
  private longTaskDuration = 0;

  private longTaskCount = 0;

  private maxMemory = 0;

  private longTaskObserver?: PerformanceObserver;

  private memoryInterval?: number;

  private readonly sampleRate: number;

  constructor(sampleRate = 1000) {
    this.sampleRate = sampleRate;
  }

  /**
   * Start observing performance metrics.
   */
  start(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        this.longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.longTaskDuration += entry.duration;
            this.longTaskCount += 1;
          });
        });
        // Chrome supports the 'longtask' type directly.
        (this.longTaskObserver as PerformanceObserver).observe({
          entryTypes: ['longtask'],
        });
      } catch (e) {
        // Ignore if PerformanceObserver isn't available or throws.
      }
    }

    if (typeof window !== 'undefined' &&
      typeof performance !== 'undefined' &&
      (performance as any).memory) {
      this.maxMemory = (performance as any).memory.usedJSHeapSize;
      this.memoryInterval = window.setInterval(() => {
        const current = (performance as any).memory.usedJSHeapSize;
        if (current > this.maxMemory) {
          this.maxMemory = current;
        }
      }, this.sampleRate);
    }
  }

  /**
   * Stop observing and return collected metrics.
   */
  stop(): IPerfMetrics {
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
    }

    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }

    // Sample once more on stop to capture final memory usage.
    if (typeof window !== 'undefined' &&
      typeof performance !== 'undefined' &&
      (performance as any).memory) {
      const current = (performance as any).memory.usedJSHeapSize;
      if (current > this.maxMemory) {
        this.maxMemory = current;
      }
    }

    return {
      longTaskDuration: this.longTaskDuration,
      longTaskCount: this.longTaskCount,
      maxMemory: this.maxMemory,
    };
  }
}

