import { FeatureFlagService, flags, ReleaseChannel } from '../../modules/featureFlags';

(() => {
  const channel: ReleaseChannel = (process.env.RELEASE_CHANNEL === 'preview') ? 'preview' : 'production';
  const service = new FeatureFlagService(channel);

  const badge = document.getElementById('release-channel-badge');
  if (badge) {
    badge.textContent = channel.toUpperCase();
  }

  Object.keys(flags).forEach((name) => {
    const button = document.createElement('button');
    button.textContent = `${name}: ${service.isEnabled(name) ? 'on' : 'off'}`;
    button.addEventListener('click', () => {
      service.toggle(name);
      button.textContent = `${name}: ${service.isEnabled(name) ? 'on' : 'off'}`;
    });
    document.body.appendChild(button);
  });
})();
