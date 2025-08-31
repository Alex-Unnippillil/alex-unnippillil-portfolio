type SoundType = 'drag' | 'drop' | 'success';

const loaders: Record<SoundType, () => Promise<any>> = {
  drag: () => import(/* webpackChunkName: "sound-drag" */ '../assets/audio/drag.mp3'),
  drop: () => import(/* webpackChunkName: "sound-drop" */ '../assets/audio/drop.mp3'),
  success: () => import(/* webpackChunkName: "sound-success" */ '../assets/audio/success.mp3'),
};

const cache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let muted = true;

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

function feedbackEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return (window as any).__feedbackEnabled !== false;
}

async function play(type: SoundType): Promise<void> {
  if (muted || !feedbackEnabled()) {
    return;
  }
  if (!cache[type]) {
    // @ts-ignore
    const module = await loaders[type]();
    const src = module.default || module;
    cache[type] = new Audio(src);
  }
  try {
    cache[type]!.currentTime = 0;
    await cache[type]!.play();
  } catch {
    // ignore any playback errors
  }
}

export const playDrag = () => play('drag');
export const playDrop = () => play('drop');
export const playSuccess = () => play('success');
