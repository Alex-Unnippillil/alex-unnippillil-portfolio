import { setupServiceWorker } from './sw-manager';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      setupServiceWorker();
    });
  }
})();
