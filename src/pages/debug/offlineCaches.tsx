import { getLastOfflineSyncSummary, IOfflineSyncSummary } from '../../services/offlineSync';

interface CacheInfo {
  size: number;
  entries: string[];
}

async function describeCache(name: string): Promise<CacheInfo> {
  const cache = await caches.open(name);
  const requests = await cache.keys();
  const entries: string[] = [];
  let size = 0;

  await Promise.all(requests.map(async (request) => {
    entries.push(request.url);
    const response = await cache.match(request);
    if (response) {
      const blob = await response.clone().blob();
      size += blob.size;
    }
  }));

  return { size, entries };
}

async function renderOfflineCaches(): Promise<void> {
  const container = document.getElementById('offline-caches');
  if (!container) return;

  container.innerHTML = '';

  const summary: IOfflineSyncSummary | null = getLastOfflineSyncSummary();
  const summaryEl = document.createElement('pre');
  summaryEl.textContent = summary
    ? JSON.stringify(summary, null, 2)
    : 'No offline sync attempts yet.';
  container.appendChild(summaryEl);

  const cacheNames = await caches.keys();
  for (const name of cacheNames) {
    const info = await describeCache(name);

    const section = document.createElement('section');
    const title = document.createElement('h3');
    title.textContent = `${name} (${(info.size / 1024).toFixed(2)} KB)`;
    section.appendChild(title);

    const list = document.createElement('ul');
    info.entries.forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      list.appendChild(li);
    });
    section.appendChild(list);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear cache';
    clearBtn.addEventListener('click', async () => {
      await caches.delete(name);
      renderOfflineCaches();
    });
    section.appendChild(clearBtn);

    container.appendChild(section);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderOfflineCaches();
});

export default renderOfflineCaches;
