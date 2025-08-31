import Survey from '../../../modules/feedback/Survey.tsx';
import { startHotspotTracking } from '../../../modules/feedback/hotspot';
import ChangelogViewer from '../../../modules/changelog/Viewer';

(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const survey = new Survey();
  survey.mount();
  startHotspotTracking();
  const changelog = new ChangelogViewer();
  changelog.init();
})();
