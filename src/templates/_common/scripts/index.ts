import { initCommandPalette } from './commandPalette';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const user = (window as any).user || {};
  initCommandPalette(user);
})();
