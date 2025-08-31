import React, { useCallback } from 'react';

interface CapabilityDialogProps {
  capability: 'notifications' | 'clipboard';
  onGranted?: () => void;
  onDenied?: () => void;
}

/**
 * A small dialog that requests the user to grant access to a browser
 * capability such as Notifications or the Clipboard. The component provides
 * context on why the permission is needed and reports the result through the
 * provided callbacks.
 */
const CapabilityDialog: React.FC<CapabilityDialogProps> = ({
  capability,
  onGranted,
  onDenied,
}) => {
  const requestPermission = useCallback(async () => {
    try {
      if (capability === 'notifications') {
        if (!('Notification' in window)) {
          onDenied?.();
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          onGranted?.();
        } else {
          onDenied?.();
        }
      } else {
        if (!navigator.clipboard) {
          onDenied?.();
          return;
        }

        await navigator.clipboard.writeText('');
        onGranted?.();
      }
    } catch {
      onDenied?.();
    }
  }, [capability, onGranted, onDenied]);

  const contextMessage = capability === 'notifications'
    ? 'This feature requires permission to send you notifications.'
    : 'This feature requires access to your clipboard for copy and paste.';

  return (
    <div role="dialog" aria-modal="true" className="capability-dialog">
      <p>{contextMessage}</p>
      <button type="button" onClick={requestPermission}>
        Allow
      </button>
    </div>
  );
};

export default CapabilityDialog;
