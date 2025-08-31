const failureBannerId = 'simulated-failure-banner';

function renderBanner(): void {
  if (document.getElementById(failureBannerId)) return;

  const banner = document.createElement('div');
  banner.id = failureBannerId;
  banner.textContent = 'Simulated Failure';
  banner.className = 'banner banner--failure';
  document.body.appendChild(banner);
}

function setupDryRun(): void {
  const button = document.createElement('button');
  button.textContent = 'Dry Run';
  button.addEventListener('click', renderBanner);
  document.body.appendChild(button);
}

document.addEventListener('DOMContentLoaded', setupDryRun);
export {};
