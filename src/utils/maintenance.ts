export function renderIncidentBanner(
  doc: Document,
  message: string,
  actionUrl: string,
  build: string,
  commit: string,
): HTMLDivElement {
  const banner = doc.createElement('div');
  banner.className = 'incident-banner';

  const text = doc.createElement('span');
  text.textContent = message;
  banner.appendChild(text);

  if (actionUrl) {
    const link = doc.createElement('a');
    link.href = actionUrl;
    link.target = '_blank';
    link.textContent = 'Action steps';
    banner.appendChild(link);
  }

  const info = doc.createElement('span');
  info.textContent = [build, commit].filter(Boolean).join(' ');
  banner.appendChild(info);

  doc.body.prepend(banner);
  return banner;
}

export function confirmProductionToggle(
  isProduction: boolean,
  confirmFn: (msg: string) => boolean = window.confirm,
): boolean {
  if (isProduction) {
    return confirmFn('Are you sure you want to modify production toggles?');
  }
  return true;
}
