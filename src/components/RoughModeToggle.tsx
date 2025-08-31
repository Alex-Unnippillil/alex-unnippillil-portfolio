import React, { useState, useEffect } from 'react';
import NetworkQuality from '../utils/networkQuality';
import RoughModeBanner from './RoughModeBanner';

const RoughModeToggle: React.FC = () => {
  const [roughMode, setRoughMode] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState(false);

  useEffect(() => {
    const slow = NetworkQuality.isSlow();
    if (slow) {
      setRoughMode(true);
      setAutoEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('rough-mode', roughMode);
    }
  }, [roughMode]);

  const toggle = () => setRoughMode((prev) => !prev);

  return (
    <>
      {autoEnabled && roughMode && (
        <RoughModeBanner onExit={() => setRoughMode(false)} />
      )}
      <button onClick={toggle} type="button">
        {roughMode ? 'Disable rough mode' : 'Enable rough mode'}
      </button>
    </>
  );
};

export default RoughModeToggle;
