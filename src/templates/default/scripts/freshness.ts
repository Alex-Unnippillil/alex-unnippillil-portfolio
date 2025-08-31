import DateUtils from '../../../utils/DateUtils';

declare global {
  interface Window {
    GPORTFOLIO_GITHUB_LOGIN?: string;
    updateBadges?: () => void;
    generateRepositoriesHtml?: (repos: any[]) => string;
  }
}

const STALE_THRESHOLD = DateUtils.DEFAULT_STALE_THRESHOLD;

function updateBadges(): void {
  const nodes = document.querySelectorAll<HTMLElement>('.repository__footer__updated');
  nodes.forEach((el) => {
    const dataTime = el.getAttribute('data-time');
    if (!dataTime) return;
    const date = new Date(dataTime);
    const relative = DateUtils.relativeTime(date);
    const absolute = date.toLocaleString();
    const span = el.querySelector<HTMLElement>('.relative-time');
    if (span) {
      span.textContent = relative;
    }
    el.setAttribute('title', absolute);
    if (DateUtils.isStale(date, STALE_THRESHOLD)) {
      el.classList.add('stale');
    } else {
      el.classList.remove('stale');
    }
  });
}

function wireRefresh(): void {
  const login = window.GPORTFOLIO_GITHUB_LOGIN;
  const button = document.getElementById('github-refresh');
  if (!login || !button) return;
  button.addEventListener('click', async () => {
    button.setAttribute('disabled', 'disabled');
    try {
      const response = await fetch(`https://api.github.com/users/${login}/repos?sort=updated`);
      if (!response.ok) return;
      const data = await response.json();
      const container = document.querySelector('.repositories');
      if (container && window.generateRepositoriesHtml) {
        container.innerHTML = window.generateRepositoriesHtml(data);
        const moreBtn = document.getElementById('github-more');
        if (moreBtn && moreBtn.parentNode && moreBtn.parentNode.parentNode) {
          moreBtn.parentNode.parentNode.removeChild(moreBtn.parentNode);
        }
        updateBadges();
      }
    } finally {
      button.removeAttribute('disabled');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  wireRefresh();
});

window.updateBadges = updateBadges;
