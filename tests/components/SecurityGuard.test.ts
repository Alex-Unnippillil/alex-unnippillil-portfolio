import { isSafeType, DANGEROUS_TYPES } from '../../src/components/previewers';

describe('SecurityGuard', () => {
  it('allows known safe types', () => {
    expect(isSafeType('image/png')).toBe(true);
    expect(isSafeType('video/mp4')).toBe(true);
    expect(isSafeType('text/plain')).toBe(true);
    expect(isSafeType('application/json')).toBe(true);
  });

  it('rejects dangerous types', () => {
    DANGEROUS_TYPES.forEach((type) => {
      expect(isSafeType(type)).toBe(false);
    });
  });
});
