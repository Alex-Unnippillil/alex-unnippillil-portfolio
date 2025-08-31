export interface Capabilities {
  webgl: boolean;
  wasm: boolean;
  clipboard: boolean;
  notifications: boolean;
  pointer: string;
}

export default class CapabilitiesDetector {
  static detect(): Capabilities {
    return {
      webgl: CapabilitiesDetector.hasWebGL(),
      wasm: CapabilitiesDetector.hasWasm(),
      clipboard: CapabilitiesDetector.hasClipboard(),
      notifications: CapabilitiesDetector.hasNotifications(),
      pointer: CapabilitiesDetector.pointerType(),
    };
  }

  static hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  static hasWasm(): boolean {
    return typeof WebAssembly === 'object';
  }

  static hasClipboard(): boolean {
    return !!navigator.clipboard;
  }

  static hasNotifications(): boolean {
    return 'Notification' in window;
  }

  static pointerType(): string {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return 'coarse';
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      return 'fine';
    }

    return 'none';
  }
}
