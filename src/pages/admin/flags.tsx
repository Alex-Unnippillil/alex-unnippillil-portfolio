import React, { useEffect, useState } from 'react';
import AuditLog from '../../models/auditLog';

const defaultFlags: Record<string, boolean> = {
  betaUI: false,
  newFeature: false,
};

const FlagsPage: React.FC = () => {
  if (process.env.VERCEL_ENV !== 'preview') {
    return <p>Access denied</p>;
  }

  const [actor, setActor] = useState('');
  const [flags, setFlags] = useState<Record<string, boolean>>(defaultFlags);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('feature-flags');
      if (raw) {
        setFlags({ ...defaultFlags, ...(JSON.parse(raw) as Record<string, boolean>) });
      }
    }
  }, []);

  const updateFlag = (name: string, value: boolean): void => {
    const updated = { ...flags, [name]: value };
    setFlags(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('feature-flags', JSON.stringify(updated));
    }
    if (actor) {
      AuditLog.record(actor, `Set ${name} to ${value}`);
    }
  };

  return (
    <div>
      <h1>Feature Flags</h1>
      <label>
        Actor:&nbsp;
        <input value={actor} onChange={(e) => setActor(e.target.value)} placeholder="engineer" />
      </label>
      <ul>
        {Object.keys(flags).map((name) => (
          <li key={name}>
            <label>
              <input
                type="checkbox"
                checked={flags[name]}
                onChange={(e) => updateFlag(name, e.target.checked)}
              />
              {name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlagsPage;
