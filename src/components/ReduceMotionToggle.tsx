import React, { useEffect, useState } from 'react';
import { applyAnimationVariables } from '../theme/animations';

const STORAGE_KEY = 'reduce-motion';

const ReduceMotionToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    applyAnimationVariables(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled]);

  return (
    <button type="button" onClick={() => setEnabled((v) => !v)}>
      {enabled ? 'Enable motion' : 'Reduce motion'}
    </button>
  );
};

export default ReduceMotionToggle;
