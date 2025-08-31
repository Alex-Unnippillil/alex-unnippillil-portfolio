import { loadBounds, saveBounds, WindowBounds } from './storage';

export interface PopoutOptions<T = unknown> {
  /** url to open */
  url: string;
  /** type of popout window used for storage */
  type: string;
  /** optional name of window */
  name?: string;
  /** initial data to synchronise with popout */
  initialData?: T;
  /** callback for incoming messages */
  onMessage?: (data: any) => void;
  /** called when popout cannot be opened */
  onFallback?: () => void;
}

export interface PopoutHandle<T = unknown> {
  /** reference to created window */
  win: Window;
  /** send message to popout */
  send: (data: T) => void;
  /** close the popout */
  close: () => void;
}

function buildFeatures(bounds?: WindowBounds): string {
  const features: Record<string, number | string> = {
    left: bounds?.left ?? 100,
    top: bounds?.top ?? 100,
    width: bounds?.width ?? 800,
    height: bounds?.height ?? 600,
  };
  return Object.entries(features)
    .map(([k, v]) => `${k}=${v}`)
    .join(',');
}

/**
 * Open a popout window and synchronise state with it using postMessage.
 * Falls back to in-page window when popouts are blocked.
 */
export function openPopout<T = unknown>(options: PopoutOptions<T>): PopoutHandle<T> | null {
  const bounds = loadBounds(options.type);
  const win = window.open(options.url, options.name ?? options.type, buildFeatures(bounds));

  if (!win) {
    options.onFallback?.();
    return null;
  }

  // detect blocked popouts that close immediately
  if (win.closed) {
    options.onFallback?.();
    return null;
  }

  // sync incoming messages
  const messageHandler = (event: MessageEvent) => {
    if (event.source === win) {
      options.onMessage?.(event.data);
    }
  };
  window.addEventListener('message', messageHandler);

  // helper to send messages to popout
  const send = (data: T): void => {
    if (!win.closed) {
      win.postMessage(data, '*');
    }
  };

  // send initial state when popout loads
  if (options.initialData !== undefined) {
    const onLoad = () => {
      send(options.initialData as T);
      win.removeEventListener('load', onLoad);
    };
    win.addEventListener('load', onLoad);
  }

  // remember window position and size
  const remember = () => {
    try {
      saveBounds(options.type, {
        left: win.screenX,
        top: win.screenY,
        width: win.outerWidth,
        height: win.outerHeight,
      });
    } catch {
      // ignore
    }
  };
  win.addEventListener('beforeunload', remember);

  // watcher to react when window is closed
  const closeWatcher = window.setInterval(() => {
    if (win.closed) {
      window.clearInterval(closeWatcher);
      window.removeEventListener('message', messageHandler);
      options.onFallback?.();
    }
  }, 500);

  const close = () => {
    window.clearInterval(closeWatcher);
    window.removeEventListener('message', messageHandler);
    remember();
    win.close();
  };

  return { win, send, close };
}

/**
 * Connect a popout window back to its opener. Used inside the popout window
 * to keep it in sync with the main page.
 */
export function connectToOpener<T = unknown>(onMessage: (data: T) => void) {
  const opener = window.opener;
  if (!opener) {
    return {
      send: () => undefined,
      dispose: () => undefined,
    };
  }

  const handler = (event: MessageEvent) => {
    if (event.source === opener) {
      onMessage(event.data as T);
    }
  };
  window.addEventListener('message', handler);

  const send = (data: T): void => {
    opener.postMessage(data, '*');
  };

  const dispose = () => {
    window.removeEventListener('message', handler);
  };

  return { send, dispose };
}
