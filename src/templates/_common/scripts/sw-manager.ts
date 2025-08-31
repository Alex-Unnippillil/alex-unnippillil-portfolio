const channel = new BroadcastChannel('sw-updates');

function showUpdateBanner(reg: ServiceWorkerRegistration) {
  const banner = document.createElement('div');
  banner.id = 'sw-update-banner';
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.background = '#000';
  banner.style.color = '#fff';
  banner.style.padding = '10px';
  banner.style.textAlign = 'center';
  banner.textContent = 'New version available. ';

  const button = document.createElement('button');
  button.textContent = 'Refresh';
  button.style.marginLeft = '10px';

  const countdown = document.createElement('span');
  let remaining = 10;
  countdown.textContent = `(${remaining})`;

  const refresh = () => {
    reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
  };

  const timer = window.setInterval(() => {
    remaining -= 1;
    countdown.textContent = `(${remaining})`;
    if (remaining <= 0) {
      clearInterval(timer);
      refresh();
    }
  }, 1000);

  button.onclick = () => {
    clearInterval(timer);
    refresh();
  };

  banner.appendChild(button);
  banner.appendChild(countdown);
  document.body.appendChild(banner);
}

function showRollbackBanner() {
  const banner = document.createElement('div');
  banner.id = 'sw-rollback-banner';
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.background = '#900';
  banner.style.color = '#fff';
  banner.style.padding = '10px';
  banner.style.textAlign = 'center';
  banner.textContent = 'Update failed. Rollback? ';

  const button = document.createElement('button');
  button.textContent = 'Rollback';
  button.style.marginLeft = '10px';
  button.onclick = () => {
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.unregister().then(() => window.location.reload());
    });
  };

  banner.appendChild(button);
  document.body.appendChild(banner);
}

function checkHealth() {
  fetch('/health.json', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('Health check failed');
    })
    .catch(() => {
      showRollbackBanner();
    });
}

function notifyUpdate(reg: ServiceWorkerRegistration) {
  channel.postMessage('update-available');
  showUpdateBanner(reg);
}

export function setupServiceWorker() {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    if (reg.waiting) {
      notifyUpdate(reg);
    }

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) {
        return;
      }
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          notifyUpdate(reg);
        }
      });
    });
  });

  channel.onmessage = (event) => {
    if (event.data === 'update-available') {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          showUpdateBanner(reg);
        }
      });
    }
    if (event.data === 'refresh') {
      window.location.reload();
    }
  };

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VERSION_READY') {
      channel.postMessage('refresh');
    }
  });

  // health check after activation
  window.addEventListener('load', () => {
    checkHealth();
  });
}
