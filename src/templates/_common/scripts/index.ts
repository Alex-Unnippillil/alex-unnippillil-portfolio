(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  if (new URLSearchParams(window.location.search).get('devtools') === '1') {
    import('./devtools').then((m) => m.initDevtools());
  }
})();
