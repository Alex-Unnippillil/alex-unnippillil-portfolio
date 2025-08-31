export type AspectPreset = 'square' | 'fourThree' | 'sixteenNine';

export interface Point {
  x: number;
  y: number;
}

export interface ArrowAnnotation {
  type: 'arrow';
  start: Point;
  end: Point;
}

export interface TextAnnotation {
  type: 'text';
  position: Point;
  text: string;
}

export type Annotation = ArrowAnnotation | TextAnnotation;

function aspectRatio(preset: AspectPreset): number {
  switch (preset) {
    case 'square':
      return 1;
    case 'fourThree':
      return 4 / 3;
    case 'sixteenNine':
      return 16 / 9;
    default:
      return 1;
  }
}

export default class ImageEditor {
  private width: number;

  private height: number;

  private rotation = 0;

  private cropRect: { x: number; y: number; width: number; height: number } | null = null;

  private annotations: Annotation[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  crop(x: number, y: number, width: number, height: number, preset?: AspectPreset) {
    let w = width;
    let h = height;
    if (preset) {
      const ratio = aspectRatio(preset);
      const current = w / h;
      if (Math.abs(current - ratio) > 0.01) {
        h = w / ratio;
      }
    }

    w = Math.min(w, this.width - x);
    h = Math.min(h, this.height - y);

    this.cropRect = {
      x,
      y,
      width: w,
      height: h,
    };

    return this.cropRect;
  }

  rotate(angle: number) {
    const rotated = (this.rotation + angle) % 360;
    this.rotation = (rotated + 360) % 360;
    return this.rotation;
  }

  addAnnotation(annotation: Annotation) {
    this.annotations.push(annotation);
  }

  enableTouch(element: HTMLElement) {
    const noop = () => {};
    element.addEventListener('touchstart', noop);
    element.addEventListener('touchmove', noop);
    element.addEventListener('touchend', noop);
  }

  export(options: { maxWidth: number; maxHeight: number; format: string }) {
    let { width, height } = this;
    if (this.cropRect) {
      width = this.cropRect.width;
      height = this.cropRect.height;
    }

    if (this.rotation % 180 !== 0) {
      const tmp = width;
      width = height;
      height = tmp;
    }

    const scale = Math.min(options.maxWidth / width, options.maxHeight / height, 1);
    const outWidth = Math.round(width * scale);
    const outHeight = Math.round(height * scale);

    return {
      width: outWidth,
      height: outHeight,
      format: options.format,
      annotations: this.annotations,
    };
  }
}
