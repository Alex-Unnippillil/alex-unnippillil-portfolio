import React from 'react';

interface IProps {
  onResume: () => void;
  message?: string;
}

export default function IdleLock({ onResume, message = 'Session paused due to inactivity. Click or press any key to resume.' }: IProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onResume}
      onKeyDown={onResume}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <p>{message}</p>
    </div>
  );
}
