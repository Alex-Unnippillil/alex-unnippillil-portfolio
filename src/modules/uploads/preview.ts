export interface PreviewOptions {
  maxWidth?: number;
  maxHeight?: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function readOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const view = new DataView(reader.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xFFD8) {
        resolve(-2); // not jpeg
        return;
      }
      let offset = 2;
      while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xFFE1) {
          offset += 2; // skip length
          if (view.getUint32(offset, false) !== 0x45786966) {
            break;
          }
          offset += 6; // skip Exif\0\0
          const little = view.getUint16(offset, false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(-1);
    };
    reader.readAsArrayBuffer(file);
  });
}

function transform(ctx: CanvasRenderingContext2D, orientation: number, width: number, height: number) {
  switch (orientation) {
    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

/**
 * Create an oriented, resized preview data URL for an image file.
 */
export async function createImagePreview(file: File, options: PreviewOptions = {}): Promise<string> {
  const orientation = await readOrientation(file);
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);

  const { maxWidth = 1024, maxHeight = 1024 } = options;
  let { width, height } = img;
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  width *= scale;
  height *= scale;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if ([5, 6, 7, 8].includes(orientation)) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  transform(ctx, orientation, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}
