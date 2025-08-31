// @ts-nocheck
import React, { useEffect, useState } from 'react';
import ResetPassword from '../templates/ResetPassword';
import data from '../../../data/email-samples/reset-password.json';

export default function ResetPasswordPreview() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const match = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(match?.matches);
    update();
    match?.addEventListener('change', update);
    const styles = Array.from(document.querySelectorAll('style'));
    const hasDark = styles.some((s) => s.innerHTML.includes('prefers-color-scheme: dark'));
    if (!hasDark) {
      // eslint-disable-next-line no-console
      console.warn('No dark mode styles detected');
    }
    return () => match?.removeEventListener('change', update);
  }, []);

  return (
    <div style={{ background: isDark ? '#000' : '#fff', color: isDark ? '#fff' : '#000', padding: 20 }}>
      <ResetPassword {...data} />
    </div>
  );
}
