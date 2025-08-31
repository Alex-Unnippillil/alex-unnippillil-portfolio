import RouteError, { errorHandler } from '../../src/modules/server/RouteError';

function createRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('RouteError', () => {
  it('formats known errors', () => {
    const err = new RouteError(404, 'NotFound', 'not found');
    const res = createRes();

    errorHandler(err, {} as any, res, () => {});

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ status: 404, code: 'NotFound', message: 'not found' });
  });

  it('formats unknown errors', () => {
    const err = new Error('boom');
    const res = createRes();

    errorHandler(err, {} as any, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, code: 'InternalError', message: 'boom' });
  });
});
