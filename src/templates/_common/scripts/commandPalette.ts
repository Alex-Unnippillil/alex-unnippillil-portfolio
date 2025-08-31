import { can, PolicyUser } from '../../utils/policy';

/**
 * Disable command palette items user is not authorized to run.
 * Command buttons should declare data-command, data-action and data-resource attributes.
 */
export function initCommandPalette(user: PolicyUser): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-command]');
  elements.forEach((el) => {
    const action = el.dataset.action || 'use';
    const resource = el.dataset.resource || el.dataset.command || '';
    if (!can(user, action, resource)) {
      el.setAttribute('disabled', 'true');
    }
  });
}

export default { initCommandPalette };

