import React, { useEffect, useState } from 'react';
import { setMuted } from '../../lib/audio';

const STORAGE_KEY = 'feedback-enabled';

function getInitial(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  return !(reduceMotion || reduceTransparency);
}

export default function Preferences(): JSX.Element {
  const [enabled, setEnabled] = useState<boolean>(() => getInitial());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
    (window as any).__feedbackEnabled = enabled;
    setMuted(!enabled);
  }, [enabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).__feedbackEnabled = enabled;
    setMuted(!enabled);
  }, []);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable feedback
      </label>
    </div>
  );
}
