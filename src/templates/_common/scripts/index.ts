import { renderIncidentBanner, confirmProductionToggle } from '../../../utils/maintenance';

(() => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    window.location.replace('/maintenance.html');
    return;
  }

  if (process.env.INCIDENT_MESSAGE) {
    renderIncidentBanner(
      document,
      String(process.env.INCIDENT_MESSAGE),
      String(process.env.INCIDENT_ACTION || ''),
      String(process.env.BUILD_ID || ''),
      String(process.env.COMMIT_SHA || ''),
    );
  }

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
})();

(window as any).confirmProductionToggle = confirmProductionToggle;
