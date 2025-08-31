import React, { useEffect } from 'react';

interface Props {
  /** Message shown to the user when a deep link is rejected */
  message?: string;
  /** Optional content to render when falling back */
  children?: React.ReactNode;
}

/**
 * Fallback component used when a deep link cannot be processed safely.
 * It shows a simple toast (using `alert`) and renders provided children.
 */
const DeepLinkFallback: React.FC<Props> = ({ message = 'Invalid or unsafe link', children }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      // Simple toast/notification for environments without dedicated UI libs
      window.alert(message);
    }
  }, [message]);

  return <>{children}</>;
};

export default DeepLinkFallback;
