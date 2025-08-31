import { mapServerErrorCode } from '../../src/errors/map';

describe('server error map', () => {
  it('should map known code', () => {
    const error = mapServerErrorCode('ENOENT');
    expect(error.short).toBe('Not found');
  });

  it('should default to unknown', () => {
    const error = mapServerErrorCode('SOME_CODE');
    expect(error.short).toBe('Unknown error');
  });
});
