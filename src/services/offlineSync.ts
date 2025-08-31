export interface IOfflineSyncSummary {
  timestamp: number;
  success: boolean;
  message?: string;
}

const STORAGE_KEY = 'offlineSync:last';

export function saveOfflineSyncSummary(summary: IOfflineSyncSummary): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Unable to store offline sync summary', e);
  }
}

export function getLastOfflineSyncSummary(): IOfflineSyncSummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as IOfflineSyncSummary : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Unable to read offline sync summary', e);
    return null;
  }
}
