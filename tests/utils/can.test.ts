import can, { CAPABILITY_MAP } from '../../src/utils/can';

describe('can helper', () => {
  it('allows capability and exposes endpoint and element', () => {
    const result = can(['EDIT_PROFILE'], 'EDIT_PROFILE');
    expect(result.allowed).toBeTruthy();
    expect(result.endpoint).toBe(CAPABILITY_MAP.EDIT_PROFILE.endpoint);
    expect(result.element).toBe(CAPABILITY_MAP.EDIT_PROFILE.element);
  });

  it('falls back when capability missing', () => {
    const result = can([], 'EDIT_PROFILE');
    expect(result.allowed).toBeFalsy();
    expect(result.endpoint).toBeUndefined();
    expect(result.element).toBe(CAPABILITY_MAP.EDIT_PROFILE.fallbackElement);
  });
});
