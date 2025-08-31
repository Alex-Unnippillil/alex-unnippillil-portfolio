import React from 'react';

const ServerErrorPage: React.FC = () => (
  <main className="error-page">
    <h1>500 - Server Error</h1>
    <p>Something went wrong on our side.</p>
    <a href="/">Go back home</a>
    <button
      type="button"
      onClick={() => {
        window.location.href = 'mailto:support@example.com?subject=500%20Error';
      }}
    >
      Report issue
    </button>
  </main>
);

export default ServerErrorPage;
