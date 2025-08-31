import { getNetworkInfo } from '../../lib/networkInfo';
import { logNetwork } from '../../lib/telemetry';

export interface ImageOptions extends Partial<HTMLImageElement> {
  src: string;
  lowQualitySrc?: string;
}

export function createImage(options: ImageOptions): HTMLImageElement {
  const { src, lowQualitySrc, ...rest } = options;
  const info = getNetworkInfo();
  const isSlow = info.saveData || (typeof info.downlink === 'number' && info.downlink < 1);
  const img = document.createElement('img');
  img.src = isSlow && lowQualitySrc ? lowQualitySrc : src;
  Object.assign(img, rest);
  logNetwork('image');
  return img;
}
export default createImage;
