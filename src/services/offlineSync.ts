export interface OfflineItem {
  /** Unique identifier of the item. */
  id: string;
  /** Timestamp used to resolve conflicts. */
  updatedAt: number;
  /** Arbitrary payload. */
  [key: string]: any;
}

export type ConflictResolver = (local: OfflineItem, remote: OfflineItem) => OfflineItem;

const STORAGE_KEY = 'offline-drafts';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Fallback storage for non-browser environments (e.g., during tests).
const memoryStore: Record<string, string> = {};
const memoryStorage: StorageLike = {
  getItem: (k) => (k in memoryStore ? memoryStore[k] : null),
  setItem: (k, v) => {
    memoryStore[k] = v;
  },
  removeItem: (k) => {
    delete memoryStore[k];
  },
};

function getStorage(): StorageLike {
  const ls = (globalThis as any).localStorage as StorageLike | undefined;
  return ls ?? memoryStorage;
}

export function loadOfflineItems(): OfflineItem[] {
  const storage = getStorage();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineItem[]) : [];
  } catch {
    return [];
  }
}

export function saveOfflineItems(items: OfflineItem[]): void {
  const storage = getStorage();
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}

export function addOfflineItem(item: OfflineItem): void {
  const items = loadOfflineItems();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  saveOfflineItems(items);
}

/**
 * Synchronises locally stored items with the server list. The caller provides
 * functions used to fetch the current server state and to persist the merged
 * result. A custom conflict resolver can be supplied to decide which side wins
 * when both local and remote items share the same identifier.
 */
export async function syncOfflineItems(
  fetchServer: () => Promise<OfflineItem[]>,
  pushServer: (items: OfflineItem[]) => Promise<void>,
  resolveConflict: ConflictResolver = (local) => local,
): Promise<OfflineItem[]> {
  const [localItems, serverItems] = await Promise.all([
    Promise.resolve(loadOfflineItems()),
    fetchServer(),
  ]);

  const merged = new Map<string, OfflineItem>();
  serverItems.forEach((item) => merged.set(item.id, item));

  localItems.forEach((item) => {
    const existing = merged.get(item.id);
    if (existing) {
      merged.set(item.id, resolveConflict(item, existing));
    } else {
      merged.set(item.id, item);
    }
  });

  const result = Array.from(merged.values());
  await pushServer(result);
  // Clear local drafts on successful sync
  getStorage().removeItem(STORAGE_KEY);
  return result;
}
