import React from 'react';

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
};

const EmptyNotifications: React.FC = () => (
  <div style={containerStyle}>
    <p>No notifications yet.</p>
    <button type="button" onClick={() => { /* placeholder */ }}>
      Refresh
    </button>
  </div>
);

export default EmptyNotifications;

