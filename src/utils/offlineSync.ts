export interface Draft<T = any> {
  id: string;
  data: T;
}

export default class OfflineSync<T = any> {
  private dbName = 'drafts';

  private storeName = 'drafts';

  private send: (draft: Draft<T>) => Promise<any>;

  private dbPromise: Promise<IDBDatabase>;

  constructor(send: (draft: Draft<T>) => Promise<any>) {
    this.send = send;
    this.dbPromise = this.openDB();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.sync();
      });
    }
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async saveDraft(id: string, data: T): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put({ id, data });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async getAllDrafts(): Promise<Draft<T>[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).getAll();
      req.onsuccess = () => resolve(req.result as Draft<T>[]);
      req.onerror = () => reject(req.error);
    });
  }

  private async removeDraft(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async sync(): Promise<void> {
    const drafts = await this.getAllDrafts();

    // eslint-disable-next-line no-restricted-syntax
    for (const draft of drafts) {
      // eslint-disable-next-line no-await-in-loop
      await this.send(draft);
      // eslint-disable-next-line no-await-in-loop
      await this.removeDraft(draft.id);
    }
  }
}
