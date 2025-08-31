export type StateEntry<T> = {
  value: T;
  tags: Set<string>;
};

export default class Store {
  private data: Map<string, StateEntry<any>> = new Map();

  public get<T>(key: string): T | undefined {
    const entry = this.data.get(key);
    return entry ? entry.value as T : undefined;
  }

  public set<T>(key: string, value: T, tags: string[] = []): void {
    this.data.set(key, { value, tags: new Set(tags) });
  }

  public invalidate(tags: string[]): void {
    if (!tags.length) {
      return;
    }

    this.data.forEach((entry, key) => {
      if (tags.some((tag) => entry.tags.has(tag))) {
        this.data.delete(key);
      }
    });
  }
}

export const store = new Store();
