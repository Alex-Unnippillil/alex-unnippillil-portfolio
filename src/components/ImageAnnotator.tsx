import React, { useRef, useState, useCallback } from 'react';

interface ImageAnnotatorProps {
  src: string;
  onChange?: (canvas: HTMLCanvasElement) => void;
}

/**
 * ImageAnnotator renders the provided image with a canvas overlay allowing the
 * user to draw simple annotations. The onChange callback returns the canvas
 * element so the consumer can extract the drawing data as needed.
 */
const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ src, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [drawing, setDrawing] = useState(false);

  const syncSize = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.width;
      canvas.height = img.height;
    }
  }, []);

  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setDrawing(true);
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx?.stroke();
  }, [drawing]);

  const endDraw = useCallback(() => {
    setDrawing(false);
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current);
    }
  }, [onChange]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img ref={imgRef} src={src} onLoad={syncSize} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', left: 0, top: 0 }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />
    </div>
  );
};

export default ImageAnnotator;
