async function toDataUrl(src: string): Promise<string> {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export default async function inlineAssets(): Promise<void> {
  const images: (HTMLImageElement | SVGImageElement)[] = [
    ...Array.from(document.querySelectorAll<HTMLImageElement>('img[src]')),
    ...Array.from(document.querySelectorAll<SVGImageElement>('svg image[href], svg image[xlink\\:href]')),
  ];

  await Promise.all(images.map(async (element) => {
    const el = element;
    const src = el instanceof SVGImageElement ? el.href.baseVal : el.src;
    if (!src || src.startsWith('data:')) {
      return;
    }

    try {
      const dataUrl = await toDataUrl(src);
      if (el instanceof SVGImageElement) {
        el.setAttribute('href', dataUrl);
        el.setAttribute('xlink:href', dataUrl);
      } else {
        (el as HTMLImageElement).src = dataUrl;
      }
    } catch (e) {
      // ignore fetch errors
    }
  }));
}
