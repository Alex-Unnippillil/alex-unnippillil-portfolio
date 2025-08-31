import handler, { _clearQueue } from '../../src/pages/api/moderation/queue';

describe('moderation queue API', () => {
  function createRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn();
    res.end = jest.fn();
    return res;
  }

  beforeEach(() => {
    _clearQueue();
  });

  it('adds and resolves items', async () => {
    // Add item
    let req: any = { method: 'POST', body: { text: 'needs review' } };
    let res = createRes();
    await handler(req, res);
    const item = res.json.mock.calls[0][0];
    expect(item.text).toBe('needs review');

    // Check queue
    req = { method: 'GET' };
    res = createRes();
    await handler(req, res);
    expect(res.json.mock.calls[0][0].length).toBe(1);

    // Approve/remove item
    req = { method: 'PUT', body: { id: item.id, action: 'approve' } };
    res = createRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Ensure queue is empty
    req = { method: 'GET' };
    res = createRes();
    await handler(req, res);
    expect(res.json.mock.calls[0][0].length).toBe(0);
  });
});
