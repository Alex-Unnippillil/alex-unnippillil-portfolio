import DiagnosticsStore from '../../src/services/diagnosticsStore';
import getDeviceInfo from '../../src/utils/deviceInfo';

jest.mock('../../src/utils/deviceInfo');

describe('DiagnosticsStore', () => {
  const deviceInfoMock = getDeviceInfo as jest.MockedFunction<typeof getDeviceInfo>;

  const storageMock = () => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  };

  beforeEach(() => {
    deviceInfoMock.mockReturnValue({
      userAgent: 'agent',
      memory: 2,
      hardwareConcurrency: 4,
      reducedMotion: false,
    });

    (global as any).sessionStorage = storageMock();
    (global as any).localStorage = storageMock();
  });

  afterEach(() => {
    deviceInfoMock.mockReset();
    delete (global as any).sessionStorage;
    delete (global as any).localStorage;
  });

  it('collects diagnostics when not opted out', () => {
    DiagnosticsStore.collect();

    expect(sessionStorage.getItem('diagnostics')).toBe(JSON.stringify({
      userAgent: 'agent',
      memory: 2,
      hardwareConcurrency: 4,
      reducedMotion: false,
    }));
  });

  it('does not collect when opted out', () => {
    localStorage.setItem('diagnosticsOptOut', 'true');
    DiagnosticsStore.collect();

    expect(sessionStorage.getItem('diagnostics')).toBeNull();
  });

  it('setOptOut persists choice', () => {
    DiagnosticsStore.setOptOut(true);
    expect(localStorage.getItem('diagnosticsOptOut')).toBe('true');

    DiagnosticsStore.setOptOut(false);
    expect(localStorage.getItem('diagnosticsOptOut')).toBeNull();
  });
});
