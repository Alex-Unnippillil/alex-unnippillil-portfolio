import React, { useEffect, useState } from 'react';

/**
 * Displays an OS-style status bar with information about caps lock state,
 * network connectivity and available storage. All features degrade gracefully
 * when the relevant APIs are not available.
 */
const StatusBar: React.FC = () => {
  const [capsLock, setCapsLock] = useState<boolean | null>(null);
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [storage, setStorage] = useState<string>('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ quota, usage }) => {
        if (quota && usage !== undefined) {
          const percent = ((usage / quota) * 100).toFixed(0);
          setStorage(`${percent}% used`);
        }
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  let capsLabel = 'N/A';
  if (capsLock !== null) {
    capsLabel = capsLock ? 'ON' : 'off';
  }

  return (
    <div className="status-bar">
      <span className="caps-lock">Caps: {capsLabel}</span>
      <span className="connection">{online ? 'Online' : 'Offline'}</span>
      <span className="storage">{storage || 'Storage N/A'}</span>
    </div>
  );
};

export default StatusBar;
