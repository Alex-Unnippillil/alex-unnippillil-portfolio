import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { log } from '../../services/audit';

const initialFlags: Record<string, boolean> = {
  featureA: false,
  featureB: false,
};

interface AdminProps {
  unauthorized?: boolean;
}

const AdminPage: React.FC<AdminProps> = ({ unauthorized }) => {
  const [flags, setFlags] = useState(initialFlags);
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const user = 'admin';

  const toggleFlag = (key: string) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
    log(user, `feature:${key}:${updated[key]}`);
  };

  const confirmAndLog = (action: string) => {
    if (window.confirm(`Are you sure you want to ${action.replace('_', ' ')}?`)) {
      log(user, action);
    }
  };

  if (unauthorized) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <h1>Admin</h1>
      <h2>Feature Flags</h2>
      <ul>
        {Object.entries(flags).map(([key, value]) => (
          <li key={key}>
            {key}: {isPreview ? (
              <input type="checkbox" checked={value} onChange={() => toggleFlag(key)} />
            ) : (
              <input type="checkbox" checked={value} readOnly />
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => confirmAndLog('flush_cache')}>Flush Cache</button>
      <button onClick={() => confirmAndLog('reset_kv')}>Reset KV</button>
      <button onClick={() => confirmAndLog('revalidate_path')}>Revalidate Path</button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<AdminProps> = async ({ req, res }) => {
  const token = process.env.ADMIN_TOKEN;
  const auth = req.headers.authorization;

  if (!token || auth !== `Bearer ${token}`) {
    res.statusCode = 401;
    return { props: { unauthorized: true } };
  }

  return { props: {} };
};

export default AdminPage;
