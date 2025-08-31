import SearchIndex, { ISearchDoc } from '../../src/modules/search/SearchIndex';

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  length = 0;

  clear(): void { this.store = {}; this.length = 0; }
  getItem(key: string): string | null { return this.store[key] ?? null; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string): void { delete this.store[key]; this.length = Object.keys(this.store).length; }
  setItem(key: string, value: string): void { this.store[key] = String(value); this.length = Object.keys(this.store).length; }
}

const compact: ISearchDoc[] = require('../../src/modules/search/compact.json');
const remote: ISearchDoc[] = require('../data/remote-facets.json');

const fetchFn = async () => remote;

describe('SearchIndex', () => {
  it('warms local index and hydrates later', async () => {
    const storage = new MemoryStorage();
    const index = new SearchIndex(compact, 'v1', fetchFn, storage);

    expect(index.search('local').length).toBe(2);
    expect(index.search('remote').length).toBe(0);

    await index.hydrate('remote-url');

    expect(index.search('remote').length).toBe(1);
  });

  it('clears cache on version change', async () => {
    const storage = new MemoryStorage();
    const indexV1 = new SearchIndex(compact, 'v1', fetchFn, storage);
    await indexV1.hydrate('remote-url');
    expect(indexV1.search('remote').length).toBe(1);

    const indexV2 = new SearchIndex(compact, 'v2', fetchFn, storage);
    expect(indexV2.search('remote').length).toBe(0);
  });
});
