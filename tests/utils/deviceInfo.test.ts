import getDeviceInfo from '../../src/utils/deviceInfo';

describe('deviceInfo', () => {
  const originalNavigator = global.navigator;
  const originalWindow = (global as any).window;

  afterEach(() => {
    (global as any).navigator = originalNavigator;
    (global as any).window = originalWindow;
  });

  it('returns info from navigator and window', () => {
    (global as any).navigator = {
      userAgent: 'agent',
      hardwareConcurrency: 4,
      deviceMemory: 2,
    } as any;
    (global as any).window = {
      matchMedia: jest.fn().mockReturnValue({ matches: true }),
    } as any;

    expect(getDeviceInfo()).toStrictEqual({
      userAgent: 'agent',
      memory: 2,
      hardwareConcurrency: 4,
      reducedMotion: true,
    });
  });

  it('handles absence of browser globals', () => {
    delete (global as any).navigator;
    delete (global as any).window;

    expect(getDeviceInfo()).toStrictEqual({
      userAgent: null,
      memory: null,
      hardwareConcurrency: null,
      reducedMotion: false,
    });
  });
});
