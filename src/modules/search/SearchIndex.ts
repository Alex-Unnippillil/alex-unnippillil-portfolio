export interface ISearchDoc {
  id: number;
  text: string;
  facets?: string[];
}

export type FetchFn = (url: string) => Promise<ISearchDoc[]>;

export default class SearchIndex {
  private index: ISearchDoc[] = [];

  private storage: Storage;

  private fetchFn: FetchFn;

  private version: string;

  private readonly storageKey = 'search-index';

  private readonly versionKey = 'search-index-version';

  constructor(
    compact: ISearchDoc[],
    version: string,
    fetchFn: FetchFn,
    storage: Storage,
  ) {
    this.storage = storage;
    this.fetchFn = fetchFn;
    this.version = version;
    this.init(compact);
  }

  private init(compact: ISearchDoc[]) {
    const storedVersion = this.storage.getItem(this.versionKey);
    if (storedVersion !== this.version) {
      this.storage.removeItem(this.storageKey);
      this.storage.setItem(this.versionKey, this.version);
    }
    const cached = this.storage.getItem(this.storageKey);
    if (cached) {
      this.index = JSON.parse(cached);
    } else {
      this.index = compact.slice();
      this.storage.setItem(this.storageKey, JSON.stringify(this.index));
    }
  }

  public scheduleHydration(url: string): void {
    const hydrate = () => { this.hydrate(url); };
    if (typeof (global as any).requestIdleCallback === 'function') {
      (global as any).requestIdleCallback(hydrate);
    } else {
      setTimeout(hydrate, 0);
    }
  }

  public async hydrate(url: string): Promise<void> {
    const remote = await this.fetchFn(url);
    const map = new Map(this.index.map((d) => [d.id, d]));
    remote.forEach((doc) => {
      const existing = map.get(doc.id);
      if (existing) {
        Object.assign(existing, doc);
      } else {
        this.index.push(doc);
      }
    });
    this.storage.setItem(this.storageKey, JSON.stringify(this.index));
  }

  public search(term: string): ISearchDoc[] {
    const lower = term.toLowerCase();
    return this.index.filter((d) => d.text.toLowerCase().includes(lower));
  }

  public getIndex(): ISearchDoc[] {
    return this.index;
  }
}
