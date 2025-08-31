import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  profile?: string;
  rendering?: 'auto' | 'crisp-edges' | 'pixelated';
}

export default function Image({ profile, rendering = 'auto', style, ...props }: ImageProps): JSX.Element {
  const mergedStyle: React.CSSProperties = { imageRendering: rendering, ...style };

  if (profile) {
    (mergedStyle as any).colorProfile = profile;
  }

  return <img {...props} style={mergedStyle} />;
}

