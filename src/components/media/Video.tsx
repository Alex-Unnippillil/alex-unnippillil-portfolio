import { getNetworkInfo } from '../../lib/networkInfo';
import { logNetwork } from '../../lib/telemetry';

export interface VideoOptions extends Partial<HTMLVideoElement> {
  src: string;
  lowQualitySrc?: string;
}

export function createVideo(options: VideoOptions): HTMLVideoElement {
  const { src, lowQualitySrc, ...rest } = options;
  const info = getNetworkInfo();
  const isSlow = info.saveData || (typeof info.downlink === 'number' && info.downlink < 1);
  const video = document.createElement('video');
  video.src = isSlow && lowQualitySrc ? lowQualitySrc : src;
  Object.assign(video, rest);
  logNetwork('video');
  return video;
}
export default createVideo;
