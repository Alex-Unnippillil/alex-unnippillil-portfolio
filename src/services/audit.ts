export interface AuditEntry {
  user: string;
  action: string;
  timestamp: string;
}

export const log = (user: string, action: string): AuditEntry => {
  const entry: AuditEntry = {
    user,
    action,
    timestamp: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[AUDIT]', entry);

  return entry;
};

export default { log };
