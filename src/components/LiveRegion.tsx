import React from 'react';

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  border: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

const LiveRegion: React.FC = () => (
  <>
    <div
      id="live-region-polite"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={visuallyHidden}
    />
    <div
      id="live-region-assertive"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={visuallyHidden}
    />
  </>
);

export default LiveRegion;
