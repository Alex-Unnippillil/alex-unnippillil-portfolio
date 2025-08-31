export interface IWindowState {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IWindowConfig {
  type: string;
  url: string;
  fallback?: () => void;
}

export default class WindowsService {
  private windows: Map<string, Window> = new Map();

  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;

    window.addEventListener('message', this.handleMessage);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  public open({ type, url, fallback }: IWindowConfig): Window | null {
    const state = this.getState(type);
    const features = state
      ? `left=${state.left},top=${state.top},width=${state.width},height=${state.height}`
      : undefined;
    const win = window.open(url, type, features);

    if (!win) {
      if (fallback) fallback();
      return null;
    }

    this.windows.set(type, win);

    win.addEventListener('beforeunload', () => {
      window.postMessage({ type: 'popout-closed', windowType: type }, '*');
    });

    return win;
  }

  public sync(type: string, state: any): void {
    const win = this.windows.get(type);
    if (win) {
      win.postMessage({ type: 'sync', windowType: type, state }, '*');
    }
  }

  private getState(type: string): IWindowState | null {
    const raw = this.storage.getItem(`window:${type}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IWindowState;
    } catch {
      return null;
    }
  }

  private handleMessage = (event: MessageEvent): void => {
    const { type, windowType, state } = event.data || {};

    if (type === 'window-state' && windowType && state) {
      this.storage.setItem(`window:${windowType}`, JSON.stringify(state));
    }

    if (type === 'popout-closed' && windowType) {
      this.windows.delete(windowType);
    }
  };

  private handleUnload = (): void => {
    this.windows.forEach((win, type) => {
      try {
        win.postMessage({ type: 'main-unload', windowType: type }, '*');
      } catch {
        // ignore
      }

      try {
        win.close();
      } catch {
        // ignore
      }
    });

    this.windows.clear();
  };
}
