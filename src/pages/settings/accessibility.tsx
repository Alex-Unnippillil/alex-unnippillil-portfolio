import React, { useEffect, useState } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
const transparencyQuery = '(prefers-reduced-transparency: reduce)';

export default function AccessibilitySettings(): JSX.Element {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia(motionQuery).matches,
  );
  const [reduceTransparency, setReduceTransparency] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia(transparencyQuery).matches,
  );

  useEffect(() => {
    document.body.classList.toggle('reduced-motion', reduceMotion);
    document.body.classList.toggle('reduced-transparency', reduceTransparency);
  }, [reduceMotion, reduceTransparency]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={reduceMotion}
          onChange={(e) => setReduceMotion(e.target.checked)}
        />
        Reduce motion
      </label>

      <label>
        <input
          type="checkbox"
          checked={reduceTransparency}
          onChange={(e) => setReduceTransparency(e.target.checked)}
        />
        Reduce transparency
      </label>
    </div>
  );
}

