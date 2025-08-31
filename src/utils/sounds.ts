// Simple sound helper that lazily loads soft UI sounds.
// Sounds are muted by default until `unmute` is called.

type SoundKey = 'tap' | 'success';

const sources: Record<SoundKey, string> = {
  tap: '/sounds/tap.mp3',
  success: '/sounds/success.mp3',
};

const cache: Partial<Record<SoundKey, HTMLAudioElement>> = {};
let muted = true;

const load = (key: SoundKey): HTMLAudioElement => {
  if (!cache[key]) {
    cache[key] = new Audio(sources[key]);
  }

  return cache[key]!;
};

const Sounds = {
  play(key: SoundKey): void {
    if (muted) {
      return;
    }

    const audio = load(key);
    audio.play().catch(() => undefined);
  },

  mute(): void {
    muted = true;
  },

  unmute(): void {
    muted = false;
  },
};

export default Sounds;
