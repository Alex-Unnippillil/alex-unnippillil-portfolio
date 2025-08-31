export default class Dock {
  private readonly storageKey = 'installedApps';

  private read(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private write(apps: string[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(apps));
    }
  }

  getInstalled(): string[] {
    return this.read();
  }

  install(app: string): void {
    const apps = this.read();
    if (!apps.includes(app)) {
      apps.push(app);
      this.write(apps);
    }
  }

  uninstall(app: string): void {
    const apps = this.read().filter((a) => a !== app);
    this.write(apps);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`app:${app}`);
      localStorage.removeItem(`shortcut:${app}`);
    }
  }
}
