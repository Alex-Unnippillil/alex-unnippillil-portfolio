import React, { useState } from 'react';
import AuditLog from '../../models/auditLog';

const MaintenancePage: React.FC = () => {
  if (process.env.VERCEL_ENV !== 'preview') {
    return <p>Access denied</p>;
  }

  const [actor, setActor] = useState('');

  const confirmAndLog = (action: string, fn: () => void): void => {
    if (window.confirm(`Are you sure you want to ${action}?`)) {
      fn();
      if (actor) {
        AuditLog.record(actor, action);
      }
      window.alert(`${action} completed`);
    }
  };

  return (
    <div>
      <h1>Maintenance</h1>
      <label>
        Actor:&nbsp;
        <input value={actor} onChange={(e) => setActor(e.target.value)} placeholder="engineer" />
      </label>
      <div>
        <button type="button" onClick={() => confirmAndLog('flush cache', () => {})}>
          Flush Cache
        </button>
      </div>
      <div>
        <button type="button" onClick={() => confirmAndLog('reset KV', () => {})}>
          Reset KV
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            const path = window.prompt('Path to revalidate?');
            if (path) {
              confirmAndLog(`revalidate ${path}`, () => {});
            }
          }}
        >
          Revalidate Path
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;
