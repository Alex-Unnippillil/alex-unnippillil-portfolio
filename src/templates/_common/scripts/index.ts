import { getNetworkInformation, sendNetworkTelemetry } from '../../../utils/network';

(() => {
  const metrics = getNetworkInformation();
  const isSlow = Boolean(metrics.saveData)
    || (metrics.downlink !== undefined && metrics.downlink < 1.5)
    || (metrics.rtt !== undefined && metrics.rtt > 300);

  const optimizeImages = (): void => {
    document.querySelectorAll<HTMLImageElement>('img[data-src-low][data-src-high]').forEach((img) => {
      const low = img.getAttribute('data-src-low');
      const high = img.getAttribute('data-src-high');
      if (isSlow) {
        if (low) {
          img.setAttribute('src', low);
        }
      } else if (high) {
        img.setAttribute('src', high);
      }
    });
  };

  const optimizeVideos = (): void => {
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      video.setAttribute('preload', isSlow ? 'none' : 'auto');
      const low = video.getAttribute('data-src-low');
      const high = video.getAttribute('data-src-high');
      const source = isSlow ? low : high;
      if (source) {
        video.setAttribute('src', source);
      }
    });
  };

  window.addEventListener('load', () => {
    optimizeImages();
    optimizeVideos();

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js');
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const duration = navigation ? navigation.duration : performance.now();
    sendNetworkTelemetry('load', duration, metrics);
  });

  window.addEventListener('click', () => {
    const start = performance.now();
    requestAnimationFrame(() => {
      const duration = performance.now() - start;
      sendNetworkTelemetry('interaction', duration, metrics);
    });
  }, { once: true });
})();
