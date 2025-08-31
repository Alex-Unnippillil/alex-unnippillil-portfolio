import GlobalDropHandler from '../../../utils/GlobalDropHandler';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  new GlobalDropHandler({
    flows: {
      'image/': (files) => console.log('image flow', files),
      'text/': (files) => console.log('text flow', files),
    },
    invalid: (files, reason) => console.warn(reason),
  });
})();
