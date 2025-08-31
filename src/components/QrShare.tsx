import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export interface QrShareProps {
  /**
   * URL that will be encoded in the QR code
   */
  url: string;
  /**
   * Size of the QR code in pixels
   */
  size?: number;
}

/**
 * Generates a QR code for sharing links.
 * Uses a canvas element so it works across modern browsers and devices.
 */
const QrShare: React.FC<QrShareProps> = ({ url, size = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, url, { width: size }, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('QR code generation failed', error);
      }
    });
  }, [url, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default QrShare;
