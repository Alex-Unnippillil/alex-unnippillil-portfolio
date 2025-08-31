import React from 'react';

const NotFoundPage: React.FC = () => (
  <main className="error-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn’t exist.</p>
    <a href="/">Go back home</a>
    <button
      type="button"
      onClick={() => {
        window.location.href = 'mailto:support@example.com?subject=404%20Error';
      }}
    >
      Report issue
    </button>
  </main>
);

export default NotFoundPage;
