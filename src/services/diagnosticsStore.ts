import getDeviceInfo, { IDeviceInfo } from '../utils/deviceInfo';

const STORAGE_KEY = 'diagnostics';
const OPT_OUT_KEY = 'diagnosticsOptOut';

function hasSessionStorage(): boolean {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch (e) {
    return false;
  }
}

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
}

export default class DiagnosticsStore {
  public static load(): IDeviceInfo | null {
    if (!hasSessionStorage()) {
      return null;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  public static save(info: IDeviceInfo): void {
    if (!hasSessionStorage()) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  }

  public static isOptOut(): boolean {
    if (!hasLocalStorage()) {
      return false;
    }

    return localStorage.getItem(OPT_OUT_KEY) === 'true';
  }

  public static setOptOut(value: boolean): void {
    if (!hasLocalStorage()) {
      return;
    }

    if (value) {
      localStorage.setItem(OPT_OUT_KEY, 'true');
    } else {
      localStorage.removeItem(OPT_OUT_KEY);
    }
  }

  public static collect(): void {
    if (DiagnosticsStore.isOptOut()) {
      return;
    }

    if (!DiagnosticsStore.load()) {
      DiagnosticsStore.save(getDeviceInfo());
    }
  }
}
