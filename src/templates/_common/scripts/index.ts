(() => {
  const defaultLocale = document.documentElement.lang || 'en';
  const supportedLocales = [defaultLocale];
  const pathLocale = window.location.pathname.split('/')[1];
  if (!supportedLocales.includes(pathLocale)) {
    const newUrl = `/${defaultLocale}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(newUrl);
    return;
  }

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
})();
