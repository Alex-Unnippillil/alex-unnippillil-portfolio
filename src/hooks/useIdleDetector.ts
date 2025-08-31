import { useEffect, useRef, useState } from 'react';

export default function useIdleDetector(onIdle: () => void, timeout = 30000): boolean {
  const [idle, setIdle] = useState(false);
  const timer = useRef<NodeJS.Timeout | undefined>();

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    setIdle(false);
    timer.current = setTimeout(() => {
      setIdle(true);
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onIdle]);

  return idle;
}
