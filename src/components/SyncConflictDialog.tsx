import React from 'react';

export interface SyncConflictDialogProps {
  /** Local representation of the item. */
  local: string;
  /** Server representation of the item. */
  remote: string;
  /**
   * Callback executed when the user chooses a side of the conflict.
   * Argument is either `'local'` or `'remote'`.
   */
  onChoose: (choice: 'local' | 'remote') => void;
}

/**
 * Simple dialog component that displays conflicting versions of a resource and
 * lets the user decide which one to keep.
 */
const SyncConflictDialog: React.FC<SyncConflictDialogProps> = ({ local, remote, onChoose }) => (
  <div className="sync-conflict-dialog">
    <div className="conflict-version">
      <h3>Local version</h3>
      <pre>{local}</pre>
      <button type="button" onClick={() => onChoose('local')}>
        Use Local
      </button>
    </div>
    <div className="conflict-version">
      <h3>Server version</h3>
      <pre>{remote}</pre>
      <button type="button" onClick={() => onChoose('remote')}>
        Use Server
      </button>
    </div>
  </div>
);

export default SyncConflictDialog;

