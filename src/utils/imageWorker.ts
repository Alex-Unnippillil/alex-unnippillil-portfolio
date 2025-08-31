self.onmessage = async (e: MessageEvent) => {
  const { file, maxWidth, maxHeight, maxSize, type, ssimThreshold } = e.data as {
    file: File | Blob;
    maxWidth: number;
    maxHeight: number;
    maxSize: number;
    type: string;
    ssimThreshold: number;
  };

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' as any });
  const aspect = bitmap.width / bitmap.height;
  let targetWidth = bitmap.width;
  let targetHeight = bitmap.height;
  if (targetWidth > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = Math.round(targetWidth / aspect);
  }
  if (targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = Math.round(targetHeight * aspect);
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    postMessage(null);
    return;
  }
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  let quality = 0.95;
  let blob = await canvas.convertToBlob({ type, quality });
  let ssim = await calculateSSIM(canvas, blob);
  while ((blob.size > maxSize || ssim < ssimThreshold) && quality > 0.4) {
    quality -= 0.05;
    blob = await canvas.convertToBlob({ type, quality });
    ssim = await calculateSSIM(canvas, blob);
  }
  postMessage(blob);
};

async function calculateSSIM(canvas: OffscreenCanvas, blob: Blob): Promise<number> {
  const ctx = canvas.getContext('2d')!;
  const original = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const bitmap = await createImageBitmap(blob);
  const tmp = new OffscreenCanvas(canvas.width, canvas.height);
  const tctx = tmp.getContext('2d')!;
  tctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const compressed = tctx.getImageData(0, 0, canvas.width, canvas.height);
  let mse = 0;
  const total = canvas.width * canvas.height;
  for (let i = 0; i < original.data.length; i += 4) {
    const dr = original.data[i] - compressed.data[i];
    const dg = original.data[i + 1] - compressed.data[i + 1];
    const db = original.data[i + 2] - compressed.data[i + 2];
    mse += (dr * dr + dg * dg + db * db) / 3;
  }
  mse /= total;
  const ssim = 1 - mse / (255 * 255);
  return ssim;
}
