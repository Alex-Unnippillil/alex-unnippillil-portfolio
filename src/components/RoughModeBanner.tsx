import React from 'react';

interface Props {
  onExit: () => void;
}

const RoughModeBanner: React.FC<Props> = ({ onExit }) => (
  <div className="rough-mode-banner">
    <span>
      You are browsing in rough mode due to a slow connection.
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onExit();
        }}
      >
        Switch back
      </a>
    </span>
  </div>
);

export default RoughModeBanner;
