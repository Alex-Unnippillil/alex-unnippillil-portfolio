import React from 'react';

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
};

const EmptyTasks: React.FC = () => (
  <div style={containerStyle}>
    <p>You're all caught up. No tasks found.</p>
    <button type="button" onClick={() => { /* placeholder */ }}>
      Add a new task
    </button>
  </div>
);

export default EmptyTasks;

