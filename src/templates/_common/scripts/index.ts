import { isCanaryClient } from '../../utils/CanaryUtils';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  if (isCanaryClient()) {
    const banner = document.createElement('div');
    banner.id = 'canary-banner';
    banner.innerHTML = 'Canary release — <a href="/feedback" target="_blank">Send feedback</a>';
    banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:yellow;color:black;padding:8px;text-align:center;z-index:1000;';
    document.addEventListener('DOMContentLoaded', () => {
      document.body.prepend(banner);
    });
  }
})();
