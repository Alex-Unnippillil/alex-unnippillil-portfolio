export interface NotificationRecord {
  id?: number;
  text: string;
  link: string;
  timestamp: number;
  read: boolean;
}

const DB_NAME = 'notifications-db';
const STORE_NAME = 'notifications';
let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const { result } = request;
        if (!result.objectStoreNames.contains(STORE_NAME)) {
          result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

async function dbGetAll(): Promise<NotificationRecord[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as NotificationRecord[]);
    request.onerror = () => reject(request.error);
  });
}

async function dbAdd(item: NotificationRecord): Promise<number> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(item);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

async function dbMarkRead(id: number): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const record = request.result as NotificationRecord;
      if (record) {
        record.read = true;
        const update = store.put(record);
        update.onsuccess = () => resolve();
        update.onerror = () => reject(update.error);
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export default class NotificationsPanel {
  private container: HTMLElement;

  constructor(containerId = 'notifications-panel') {
    this.container = document.createElement('div');
    this.container.id = containerId;
    this.container.style.position = 'fixed';
    this.container.style.bottom = '0';
    this.container.style.right = '0';
    this.container.style.background = '#fff';
    this.container.style.maxWidth = '300px';
    this.container.style.maxHeight = '400px';
    this.container.style.overflowY = 'auto';
    this.container.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    this.container.style.fontSize = '14px';
    document.body.appendChild(this.container);

    this.render();
  }

  async push(text: string, link: string): Promise<void> {
    const item: NotificationRecord = {
      text,
      link,
      timestamp: Date.now(),
      read: false,
    };

    await dbAdd(item);
    await this.render();
  }

  private async render(): Promise<void> {
    const notifications = await dbGetAll();
    notifications.sort((a, b) => b.timestamp - a.timestamp);

    this.container.innerHTML = '';

    notifications.forEach((n) => {
      const item = document.createElement('div');
      item.style.padding = '8px';
      item.style.cursor = 'pointer';
      item.style.borderBottom = '1px solid #ddd';
      item.style.background = n.read ? '#f5f5f5' : '#e6f7ff';
      item.textContent = `${n.text} — ${new Date(n.timestamp).toLocaleString()}`;
      item.addEventListener('click', async () => {
        if (n.id) {
          await dbMarkRead(n.id);
        }
        if (n.link) {
          window.open(n.link, '_blank');
        }
        this.render();
      });
      this.container.appendChild(item);
    });
  }
}
