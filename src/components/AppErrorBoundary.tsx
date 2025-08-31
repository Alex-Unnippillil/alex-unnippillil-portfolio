import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface AppErrorBoundaryProps {
  appName: string;
  children: ReactNode;
}

/**
 * AppErrorBoundary provides isolation for individual apps within the page so
 * that a failure in one widget does not break others.
 */
const AppErrorBoundary = ({ appName, children }: AppErrorBoundaryProps): JSX.Element => (
  <ErrorBoundary
    fallback={(
      <div>
        <p>{appName} crashed.</p>
        <button type="button" onClick={() => window.location.reload()}>Retry</button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default AppErrorBoundary;

