interface QueueItem {
  id: string;
  content: string;
}

const queue: QueueItem[] = [];

export default function handler(req: any, res: any): void {
  if (req.method === 'GET') {
    res.status(200).json(queue);
    return;
  }

  if (req.method === 'POST') {
    queue.push(req.body as QueueItem);
    res.status(201).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = req.body as { id: string };
    const index = queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      queue.splice(index, 1);
    }
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
