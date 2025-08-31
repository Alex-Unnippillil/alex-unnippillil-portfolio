import NotificationsPanel from './notifications';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    (window as any).notificationsPanel = new NotificationsPanel();
  }
})();
