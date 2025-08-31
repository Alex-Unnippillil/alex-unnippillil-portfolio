export default class DpiAware {
  static getCssPixelRatio(): number {
    if (typeof window !== 'undefined' && window.devicePixelRatio) {
      return window.devicePixelRatio;
    }

    if (typeof global !== 'undefined' && (global as any).devicePixelRatio) {
      return (global as any).devicePixelRatio;
    }

    return 1;
  }

  static scaleCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    const ratio = DpiAware.getCssPixelRatio();
    const { width, height } = canvas;

    // Preserve original display size
    if (canvas.style) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    context.scale(ratio, ratio);
  }

  static scaleImage(img: HTMLImageElement): void {
    const ratio = DpiAware.getCssPixelRatio();
    const { width, height } = img;

    if (img.style) {
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
    }

    img.width = Math.floor(width * ratio);
    img.height = Math.floor(height * ratio);
  }
}

