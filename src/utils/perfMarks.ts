export const markFirstPaint = (): void => {
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return;
  }

  const startMark = 'first-paint-start';
  const endMark = 'first-paint-end';
  const measureName = 'first-paint';

  if (typeof performance.mark !== 'function' || typeof performance.measure !== 'function') {
    return;
  }

  performance.mark(startMark);

  const afterPaint = (): void => {
    performance.mark(endMark);
    try {
      performance.measure(measureName, startMark, endMark);
    } catch (e) {
      // ignore measure errors
    }
  };

  if (document.readyState === 'complete') {
    requestAnimationFrame(afterPaint);
  } else {
    window.addEventListener('load', () => {
      requestAnimationFrame(afterPaint);
    });
  }
};

export default {
  markFirstPaint,
};
