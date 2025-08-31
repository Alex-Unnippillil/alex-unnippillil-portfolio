import contentFilter from '../../src/middleware/contentFilter';

describe('contentFilter middleware', () => {
  function createRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  it('blocks profanity', () => {
    const req: any = { body: { text: 'This is damn text' } };
    const res = createRes();
    const next = jest.fn();
    contentFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks URLs', () => {
    const req: any = { body: { text: 'Check http://example.com' } };
    const res = createRes();
    const next = jest.fn();
    contentFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows clean text', () => {
    const req: any = { body: { text: 'Hello world' } };
    const res = createRes();
    const next = jest.fn();
    contentFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
