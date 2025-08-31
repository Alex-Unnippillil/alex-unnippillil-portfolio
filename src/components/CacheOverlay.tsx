import React, { useEffect, useState } from 'react';

interface DebugInfo {
  cacheControl: string;
  cdnStatus: string;
  etag: string;
  responseTime: number;
  hitRate: number;
}

const CacheOverlay: React.FC = () => {
  const [info, setInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    fetch(`/cache-debug?path=${encodeURIComponent(path)}`)
      .then((res) => res.json())
      .then((data: DebugInfo) => setInfo(data))
      .catch(() => {
        // ignore
      });
  }, []);

  if (!info) {
    return null;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '8px',
    fontSize: '12px',
    zIndex: 9999,
  };

  return (
    <div style={style}>
      <div>L1/Cache-Control: {info.cacheControl || 'n/a'}</div>
      <div>CDN: {info.cdnStatus}</div>
      <div>ETag: {info.etag || 'n/a'}</div>
      <div>Hit Rate: {(info.hitRate * 100).toFixed(1)}%</div>
      <div>Response: {info.responseTime.toFixed(2)}ms</div>
    </div>
  );
};

export default CacheOverlay;
