export interface AuditEntry {
  actor: string;
  change: string;
  timestamp: number;
}

/**
 * Simple audit log storing entries in memory and localStorage.
 */
export default class AuditLog {
  private static STORAGE_KEY = 'audit-log';

  private static inMemory: AuditEntry[] = [];

  static record(actor: string, change: string): void {
    const entry: AuditEntry = { actor, change, timestamp: Date.now() };
    AuditLog.inMemory.push(entry);
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(AuditLog.STORAGE_KEY);
      const entries: AuditEntry[] = raw ? JSON.parse(raw) : [];
      entries.push(entry);
      window.localStorage.setItem(AuditLog.STORAGE_KEY, JSON.stringify(entries));
    }
  }

  static entries(): AuditEntry[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(AuditLog.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
    }
    return AuditLog.inMemory;
  }
}
