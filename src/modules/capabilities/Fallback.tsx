import React from 'react';

interface FallbackProps {
  capability: 'notifications' | 'clipboard';
}

/**
 * Displays a simple message when a required capability is not supported by the
 * current environment. Using a dedicated component ensures that core flows can
 * continue even if optional features are unavailable.
 */
const CapabilityFallback: React.FC<FallbackProps> = ({ capability }) => (
  <div className="capability-fallback">
    {capability} capability is not supported in this browser.
  </div>
);

export default CapabilityFallback;
