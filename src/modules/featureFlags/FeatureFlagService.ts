import flags, { FlagDefaults } from './flags';

export type ReleaseChannel = 'preview' | 'production';

type ConfirmFn = (message: string) => boolean;

export default class FeatureFlagService {
  private channel: ReleaseChannel;

  private storage?: Storage;

  constructor(channel: ReleaseChannel, storage?: Storage) {
    this.channel = channel;
    this.storage = storage;
  }

  public isEnabled(name: string): boolean {
    const stored = this.getStoredValue(name);
    if (stored !== null) {
      return stored;
    }
    const def: FlagDefaults | undefined = flags[name];
    return def ? def[this.channel] : false;
  }

  public toggle(name: string, confirmFn?: ConfirmFn): void {
    const def = flags[name];
    const isDangerous = def?.dangerous && this.channel === 'production';
    const confirm = confirmFn ?? ((msg: string) => window.confirm(msg));
    if (isDangerous) {
      const first = confirm(`Enable ${name}?`);
      if (!first) {
        return;
      }
      const second = confirm('Are you sure? This may be dangerous.');
      if (!second) {
        return;
      }
    }
    const value = !this.isEnabled(name);
    this.storeValue(name, value);
  }

  private storageKey(name: string): string {
    return `feature:${this.channel}:${name}`;
  }

  private getStoredValue(name: string): boolean | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }
    const item = storage.getItem(this.storageKey(name));
    if (item === null) {
      return null;
    }
    return item === 'true';
  }

  private storeValue(name: string, value: boolean): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(this.storageKey(name), String(value));
  }

  private getStorage(): Storage | undefined {
    if (this.storage) {
      return this.storage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return undefined;
  }
}
