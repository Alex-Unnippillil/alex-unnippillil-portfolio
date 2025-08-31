/**
 * Utility for normalising image orientation and resizing before upload.
 * Returns a new File object with the adjusted image data.
 */
export default async function prepareImage(
  file: File,
  maxSize = 1024,
): Promise<File> {
  const orientation = await getOrientation(file);
  const img = await loadImage(file);

  // initial canvas dimensions
  let canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;

  if (orientation > 4 && orientation < 9) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return file;
  }

  // apply orientation transforms
  switch (orientation) {
    case 2:
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(canvas.width, canvas.height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -canvas.height);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(canvas.width, -canvas.height);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-canvas.width, 0);
      break;
    default:
      break;
  }

  ctx.drawImage(img, 0, 0);

  // resize if needed
  const scale = Math.min(1, maxSize / Math.max(canvas.width, canvas.height));
  if (scale < 1) {
    const resized = document.createElement('canvas');
    resized.width = canvas.width * scale;
    resized.height = canvas.height * scale;
    const rctx = resized.getContext('2d');
    if (rctx) {
      rctx.drawImage(canvas, 0, 0, resized.width, resized.height);
      canvas = resized;
    }
  }

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.95);
  });

  return new File([blob], file.name, { type: 'image/jpeg' });
}

// Reads orientation from EXIF data
function getOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const view = new DataView(event.target?.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(-2);
        return;
      }
      let offset = 2;
      while (offset < view.byteLength) {
        if (view.getUint16(offset + 2, false) <= 8) break;
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xffe1) {
          const little = view.getUint16(offset + 8, false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i += 1) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
