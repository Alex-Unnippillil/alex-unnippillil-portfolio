import HistoryManager, { HistoryEntry } from '../../lib/history';

/**
 * Registers API routes responsible for history management. The routes are kept
 * intentionally lightweight so that they can run in development without
 * pulling in additional dependencies.  The `app` parameter is assumed to be
 * an Express-like instance exposing `post` methods.
 */
export function registerHistoryRoutes(app: any, history = new HistoryManager()): void {
  // Record a history entry
  app.post('/api/history/push', (req: any, res: any) => {
    const body: HistoryEntry = req.body || {};
    history.push(body);
    res.json({ status: 'ok' });
  });

  // Undo one or more steps from the history
  app.post('/api/history/undo', (req: any, res: any) => {
    const steps = typeof req.body?.steps === 'number' ? req.body.steps : 1;
    const undone = history.undo(steps);
    res.json({ undone });
  });
}
