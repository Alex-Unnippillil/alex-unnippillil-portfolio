import { initLazyImages } from './lazyImages';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initLazyImages();
  });
})();
