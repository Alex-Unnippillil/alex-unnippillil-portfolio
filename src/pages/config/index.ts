import PrivacyMode from '../../modules/core/PrivacyMode';

(() => {
  // initialise privacy mode with 5s timeout before auto-activation
  const privacyMode = new PrivacyMode({ timeout: 5000 });
  // expose for debugging
  (window as any).privacyMode = privacyMode;
})();
