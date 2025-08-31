export interface Snapshot<T = unknown> {
  id: string;
  data: T;
  createdAt: number;
}

const STORAGE_KEY = 'snapshots';
const MAX_SNAPSHOTS = 20;

const listeners: Array<() => void> = [];

function load(): Snapshot[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Snapshot[];
      } catch {
        return [];
      }
    }
  }
  return [];
}

let snapshots: Snapshot[] = load();

function save(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  }
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function purgeSnapshots(limit: number = MAX_SNAPSHOTS): void {
  if (snapshots.length > limit) {
    snapshots = snapshots.slice(snapshots.length - limit);
    save();
  }
}

export function addSnapshot<T>(data: T): string {
  const snapshot: Snapshot<T> = {
    id: Date.now().toString(),
    data,
    createdAt: Date.now(),
  };
  snapshots.push(snapshot);
  purgeSnapshots();
  save();
  emit();
  return snapshot.id;
}

export function getSnapshots(): Snapshot[] {
  return [...snapshots];
}

export function restoreSnapshot<T>(id: string): T | undefined {
  const snapshot = snapshots.find((s) => s.id === id);
  return snapshot?.data as T | undefined;
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
}
