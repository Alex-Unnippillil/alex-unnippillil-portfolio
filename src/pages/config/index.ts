import { processImage } from '../../utils/ImageProcessor';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('imageInput') as HTMLInputElement | null;
  if (!input) return;
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      const blob = await processImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        maxSize: 500_000,
        ssimThreshold: 0.95,
        type: 'image/webp',
      });
      console.log('processed image', blob.size);
    } catch (err) {
      console.error('processing failed', err);
    }
  });
});
