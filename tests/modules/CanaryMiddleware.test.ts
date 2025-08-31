import canaryMiddleware from '../../src/modules/server/canaryMiddleware';

describe('canaryMiddleware', () => {
  it('prefixes url when canary cookie is set', () => {
    const req: any = { headers: { cookie: 'foo=bar; canary=true' }, url: '/test' };
    const next = jest.fn();
    canaryMiddleware(req, {}, next);
    expect(req.url).toBe('/canary/test');
    expect(next).toHaveBeenCalled();
  });

  it('prefixes url when canary header is present', () => {
    const req: any = { headers: { 'x-canary': 'true' }, url: '/home' };
    canaryMiddleware(req, {}, () => {});
    expect(req.url).toBe('/canary/home');
  });

  it('does nothing when flag absent', () => {
    const req: any = { headers: {}, url: '/root' };
    canaryMiddleware(req, {}, () => {});
    expect(req.url).toBe('/root');
  });
});
