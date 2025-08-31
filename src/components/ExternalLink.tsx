import React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<Props> = ({ children, ...props }) => (
  <a target="_blank" rel="noopener noreferrer" {...props}>
    {children}
    <span aria-hidden="true">↗</span>
  </a>
);

export default ExternalLink;
