import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

/**
 * GlobalErrorBoundary wraps the entire application and provides a retry button
 * to attempt recovery from unexpected errors.
 */
const GlobalErrorBoundary = ({ children }: GlobalErrorBoundaryProps): JSX.Element => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

export default GlobalErrorBoundary;

