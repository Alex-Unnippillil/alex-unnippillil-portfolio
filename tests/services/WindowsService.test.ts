import WindowsService from '../../src/services/windows';

function createMockWindow() {
  const listeners: Record<string, Function> = {};
  return {
    postMessage: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn((event: string, handler: Function) => {
      listeners[event] = handler;
    }),
    trigger: (event: string) => {
      if (listeners[event]) {
        listeners[event]();
      }
    },
  } as any;
}

describe('WindowsService', () => {
  let localStorageMock: any;
  let globalWin: any;
  let service: WindowsService;
  let globalListeners: Record<string, Function>;

  beforeEach(() => {
    globalListeners = {};
    localStorageMock = {
      data: {} as Record<string, string>,
      getItem: jest.fn((k: string) => (
        k in localStorageMock.data ? localStorageMock.data[k] : null
      )),
      setItem: jest.fn((k: string, v: string) => {
        localStorageMock.data[k] = v;
      }),
      removeItem: jest.fn((k: string) => {
        delete localStorageMock.data[k];
      }),
    };

    globalWin = {
      open: jest.fn(),
      postMessage: jest.fn(),
      addEventListener: jest.fn((event: string, handler: Function) => {
        globalListeners[event] = handler;
      }),
      dispatchEvent: (event: Event) => {
        const handler = globalListeners[event.type];
        if (handler) handler(event);
      },
      localStorage: localStorageMock,
    } as any;

    (global as any).window = globalWin;
    service = new WindowsService(localStorageMock);
  });

  afterEach(() => {
    delete (global as any).window;
    jest.clearAllMocks();
  });

  it('opens window with persisted size and position', () => {
    localStorageMock.data['window:chat'] = JSON.stringify({
      left: 1,
      top: 2,
      width: 300,
      height: 200,
    });
    const child = createMockWindow();
    globalWin.open.mockReturnValue(child);

    const win = service.open({ type: 'chat', url: '/chat' });

    expect(win).toBe(child);
    expect(globalWin.open).toHaveBeenCalledWith('/chat', 'chat', 'left=1,top=2,width=300,height=200');
  });

  it('falls back to in-page window when blocked', () => {
    globalWin.open.mockReturnValue(null);
    const fallback = jest.fn();

    const win = service.open({ type: 'chat', url: '/chat', fallback });

    expect(win).toBeNull();
    expect(fallback).toHaveBeenCalled();
  });

  it('syncs state via postMessage and persists updates', () => {
    const child = createMockWindow();
    globalWin.open.mockReturnValue(child);
    service.open({ type: 'chat', url: '/chat' });

    service.sync('chat', { a: 1 });
    expect(child.postMessage).toHaveBeenCalledWith(
      { type: 'sync', windowType: 'chat', state: { a: 1 } },
      '*',
    );

    globalWin.dispatchEvent({
      type: 'message',
      data: {
        type: 'window-state',
        windowType: 'chat',
        state: {
          left: 10,
          top: 20,
          width: 400,
          height: 300,
        },
      },
    } as any);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'window:chat',
      JSON.stringify({
        left: 10,
        top: 20,
        width: 400,
        height: 300,
      }),
    );
  });

  it('notifies and closes popouts on unload', () => {
    const child = createMockWindow();
    globalWin.open.mockReturnValue(child);
    service.open({ type: 'chat', url: '/chat' });

    globalWin.dispatchEvent({ type: 'beforeunload' } as any);

    expect(child.postMessage).toHaveBeenCalledWith({ type: 'main-unload', windowType: 'chat' }, '*');
    expect(child.close).toHaveBeenCalled();
  });

  it('removes window on popout close', () => {
    const child = createMockWindow();
    globalWin.open.mockReturnValue(child);
    service.open({ type: 'chat', url: '/chat' });

    child.trigger('beforeunload');

    expect(globalWin.postMessage).toHaveBeenCalledWith({ type: 'popout-closed', windowType: 'chat' }, '*');

    globalWin.dispatchEvent({ type: 'message', data: { type: 'popout-closed', windowType: 'chat' } } as any);

    child.postMessage.mockClear();
    service.sync('chat', {});
    expect(child.postMessage).not.toHaveBeenCalled();
  });
});
