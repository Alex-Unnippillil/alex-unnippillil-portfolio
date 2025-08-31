/* eslint-disable @typescript-eslint/no-use-before-define */
import SanitizeText from '../../../utils/sanitizeText';

interface QueueItem {
  id: string;
  content: string;
}

function renderQueue(items: QueueItem[]): void {
  const container = document.getElementById('queue');
  if (!container) {
    return;
  }
  container.innerHTML = '';
  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'queue-item';
    div.textContent = SanitizeText.sanitize(item.content);

    const approve = document.createElement('button');
    approve.textContent = 'Approve';
    approve.addEventListener('click', () => handleAction(item.id, true));

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => handleAction(item.id, false));

    div.appendChild(approve);
    div.appendChild(remove);
    container.appendChild(div);
  });
}

async function loadQueue(): Promise<void> {
  const resp = await fetch('/api/moderation/queue');
  const data: QueueItem[] = await resp.json();
  renderQueue(data);
}

async function handleAction(id: string, approve: boolean): Promise<void> {
  await fetch('/api/moderation/queue', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, approve }),
  });
  await loadQueue();
}

loadQueue();
