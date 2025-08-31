interface QueueItem {
  id: string;
  text: string;
}

let queue: QueueItem[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default async function handler(req: any, res: any): Promise<void> {
  const { method } = req;

  if (method === 'GET') {
    res.status(200).json(queue);
    return;
  }

  if (method === 'POST') {
    const { text } = req.body || {};
    if (typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Missing text' });
      return;
    }
    const item = { id: generateId(), text };
    queue.push(item);
    res.status(201).json(item);
    return;
  }

  if (method === 'PUT') {
    const { id, action } = req.body || {};
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }
    queue = queue.filter((item) => item.id !== id);
    res.status(200).json({ id, action });
    return;
  }

  res.status(405).end();
}

export function _clearQueue(): void {
  queue = [];
}
