export default function measureCLS(callback: (cls: number) => void): void {
  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const shift = entry as LayoutShift;
      if (!shift.hadRecentInput) {
        clsValue += shift.value;
      }
    });
  });
  observer.observe({ type: 'layout-shift', buffered: true });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      observer.disconnect();
      callback(clsValue);
    }
  });
}
