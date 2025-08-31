export default class TagCache<T = any> {
  private store: Map<string, { value: T; tags: Set<string> }> = new Map();

  private tagMap: Map<string, Set<string>> = new Map();

  public set(key: string, value: T, tags: string[] = []): void {
    const tagSet = new Set(tags);
    this.store.set(key, { value, tags: tagSet });

    tags.forEach((tag) => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)!.add(key);
    });
  }

  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    return entry ? entry.value : undefined;
  }

  public invalidateTags(tags: string[]): void {
    tags.forEach((tag) => {
      const keys = this.tagMap.get(tag);
      if (!keys) {
        return;
      }
      keys.forEach((key) => {
        this.store.delete(key);
      });
      this.tagMap.delete(tag);
    });
  }

  public clear(): void {
    this.store.clear();
    this.tagMap.clear();
  }
}
