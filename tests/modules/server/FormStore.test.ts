import FormStore from '../../../src/modules/server/FormStore';

describe('FormStore', () => {
  function createRes() {
    const res: any = {};
    res.statusCode = 200;
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.jsonData = undefined;
    res.json = (data: any) => {
      res.jsonData = data;
      return res;
    };
    return res;
  }

  it('increments version on successful submit', () => {
    const store = new FormStore();
    const req: any = { headers: {}, body: { data: { foo: 'a' }, version: 0 } };
    const res = createRes();
    store.submit(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.jsonData.version).toBe(1);
  });

  it('returns diff on version conflict', () => {
    const store = new FormStore();
    const firstReq: any = { headers: {}, body: { data: { foo: 'a' }, version: 0 } };
    const firstRes = createRes();
    store.submit(firstReq, firstRes);

    const conflictReq: any = { headers: { 'if-match': '0' }, body: { data: { foo: 'b' } } };
    const conflictRes = createRes();
    store.submit(conflictReq, conflictRes);

    expect(conflictRes.statusCode).toBe(409);
    expect(conflictRes.jsonData.diff.foo).toEqual({ current: 'a', incoming: 'b' });
  });
});
