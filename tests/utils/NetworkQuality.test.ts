import NetworkQuality from '../../src/utils/networkQuality';

describe('NetworkQuality', () => {
  it('returns false when connection info unavailable', () => {
    expect(NetworkQuality.isSlow()).toBeFalsy();
  });
});
