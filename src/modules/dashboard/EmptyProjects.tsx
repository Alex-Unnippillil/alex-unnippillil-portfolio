import React from 'react';

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
};

const EmptyProjects: React.FC = () => (
  <div style={containerStyle}>
    <p>No projects have been created yet.</p>
    <button type="button" onClick={() => { /* placeholder */ }}>
      Create your first project
    </button>
  </div>
);

export default EmptyProjects;

