import StorageLike from './StorageLike';

export default class MemoryStorage implements StorageLike {
  private data: Map<string, string> = new Map();

  public getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key) as string : null;
  }

  public setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}
