import React, { useEffect, useState } from 'react';

const TOUR_STORAGE_KEY = 'welcomeTourDismissed';

interface Step {
  title: string;
  content: string;
}

const steps: Step[] = [
  { title: 'Welcome', content: 'Welcome to the dashboard!' },
  { title: 'Projects', content: 'Track your projects here.' },
  { title: 'Settings', content: 'Adjust your preferences any time.' },
];

const Tour: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      setVisible(false);
    }
  };

  const handleSkip = () => {
    setVisible(false);
  };

  const handleNeverShow = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  const step = steps[stepIndex];

  return (
    <div className="tour-overlay" style={overlayStyle}>
      <div className="tour-step" style={stepStyle}>
        <h2>{step.title}</h2>
        <p>{step.content}</p>
        <div className="tour-actions" style={actionsStyle}>
          <button type="button" onClick={handleSkip}>Skip</button>
          <button type="button" onClick={handleNeverShow}>Never show again</button>
          <button type="button" onClick={handleNext}>{stepIndex + 1 === steps.length ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const stepStyle: React.CSSProperties = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '4px',
  textAlign: 'center',
  maxWidth: '400px',
};

const actionsStyle: React.CSSProperties = {
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
};

export default Tour;

