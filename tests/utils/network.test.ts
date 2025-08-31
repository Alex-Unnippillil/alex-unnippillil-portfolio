import { getNetworkInformation } from '../../src/utils/network';

describe('network utils', () => {
  afterEach(() => {
    delete (global as any).navigator;
  });

  it('returns undefined metrics without connection', () => {
    const info = getNetworkInformation();
    expect(info).toEqual({ downlink: undefined, rtt: undefined, saveData: undefined });
  });

  it('reads metrics from navigator.connection', () => {
    (global as any).navigator = {
      connection: { downlink: 1.5, rtt: 100, saveData: false },
    };
    const info = getNetworkInformation();
    expect(info).toEqual({ downlink: 1.5, rtt: 100, saveData: false });
  });
});
