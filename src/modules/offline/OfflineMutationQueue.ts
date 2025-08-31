import { EventEmitter } from 'events';

export type MutationStatus = 'queued' | 'processing' | 'success' | 'error' | 'conflict';

export interface Mutation<T = any> {
  id?: number;
  data: T;
}

export interface MutationRecord<T = any> extends Mutation<T> {
  id: number;
  status: MutationStatus;
  retries: number;
}

export interface MutationStore<T = any> {
  add(record: MutationRecord<T>): Promise<number>;
  update(record: MutationRecord<T>): Promise<void>;
  getAll(): Promise<MutationRecord<T>[]>;
  delete(id: number): Promise<void>;
}

export class IndexedDBMutationStore<T = any> implements MutationStore<T> {
  private dbPromise: Promise<IDBDatabase>;

  private storeName: string;

  constructor(dbName = 'mutation-queue', storeName = 'mutations') {
    this.storeName = storeName;
    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const open = indexedDB.open(dbName, 1);

      open.onupgradeneeded = () => {
        open.result.createObjectStore(this.storeName, { keyPath: 'id' });
      };

      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
  }

  protected async db(): Promise<IDBDatabase> {
    return this.dbPromise;
  }

  async add(record: MutationRecord<T>): Promise<number> {
    const db = await this.db();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(record);
      tx.oncomplete = () => resolve(record.id);
      tx.onerror = () => reject(tx.error);
    });
  }

  async update(record: MutationRecord<T>): Promise<void> {
    await this.add(record);
  }

  async getAll(): Promise<MutationRecord<T>[]> {
    const db = await this.db();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).getAll();
      req.onsuccess = () => resolve(req.result as MutationRecord<T>[]);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: number): Promise<void> {
    const db = await this.db();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export class InMemoryMutationStore<T = any> implements MutationStore<T> {
  private items = new Map<number, MutationRecord<T>>();

  async add(record: MutationRecord<T>): Promise<number> {
    this.items.set(record.id, record);
    return record.id;
  }

  async update(record: MutationRecord<T>): Promise<void> {
    this.items.set(record.id, record);
  }

  async getAll(): Promise<MutationRecord<T>[]> {
    return Array.from(this.items.values());
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }
}

export class ConflictError extends Error {
  serverState: any;

  constructor(serverState: any) {
    super('Mutation conflict');
    this.serverState = serverState;
    this.name = 'ConflictError';
  }
}

export interface ConflictEvent<T = any> {
  mutation: MutationRecord<T>;
  diff: { local: string; remote: string };
  resolveWithLocal: () => Promise<void>;
  resolveWithServer: () => Promise<void>;
}

export default class OfflineMutationQueue<T = any> extends EventEmitter {
  protected store: MutationStore<T>;

  protected baseDelay: number;

  protected maxDelay: number;

  constructor(store: MutationStore<T> = new IndexedDBMutationStore(), options: { baseDelay?: number; maxDelay?: number } = {}) {
    super();
    this.store = store;
    this.baseDelay = options.baseDelay ?? 1000;
    this.maxDelay = options.maxDelay ?? 16000;
  }

  async enqueue(data: T): Promise<number> {
    const record: MutationRecord<T> = {
      id: Date.now(),
      data,
      status: 'queued',
      retries: 0,
    };
    await this.store.add(record);
    this.emit('status', record);
    return record.id;
  }

  async process(processor: (data: T) => Promise<any>): Promise<void> {
    const records = await this.store.getAll();
    // process sequentially
    // eslint-disable-next-line no-restricted-syntax
    for (const record of records) {
      // eslint-disable-next-line no-await-in-loop
      await this.processRecord(record, processor);
    }
  }

  protected async processRecord(record: MutationRecord<T>, processor: (data: T) => Promise<any>): Promise<void> {
    let delay = this.baseDelay;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      record.status = 'processing';
      await this.store.update(record);
      this.emit('status', { ...record });

      try {
        // eslint-disable-next-line no-await-in-loop
        await processor(record.data);
        record.status = 'success';
        await this.store.delete(record.id);
        this.emit('status', { ...record });
        return;
      } catch (err: any) {
        if (err instanceof ConflictError || err?.name === 'ConflictError') {
          record.status = 'conflict';
          this.emit('status', { ...record });
          const diff = {
            local: JSON.stringify(record.data, null, 2),
            remote: JSON.stringify(err.serverState, null, 2),
          };
          const resolveWithLocal = async () => {
            await this.processRecord(record, processor);
          };
          const resolveWithServer = async () => {
            await this.store.delete(record.id);
            this.emit('status', { ...record, status: 'success' });
          };
          this.emit('conflict', {
            mutation: { ...record },
            diff,
            resolveWithLocal,
            resolveWithServer,
          } as ConflictEvent<T>);
          return;
        }

        record.status = 'error';
        record.retries += 1;
        await this.store.update(record);
        this.emit('status', { ...record });
        // eslint-disable-next-line no-await-in-loop
        await this.delay(delay);
        delay = Math.min(delay * 2, this.maxDelay);
      }
    }
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
