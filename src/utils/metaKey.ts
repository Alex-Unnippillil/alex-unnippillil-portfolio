export type Layout = 'mac' | 'windows';

const MAC_PLATFORMS = ['mac', 'iphone', 'ipod', 'ipad'];

export const getLayout = (): Layout => {
  if (typeof navigator === 'undefined') {
    return 'windows';
  }
  const platform = navigator.platform.toLowerCase();
  return MAC_PLATFORMS.some((p) => platform.includes(p))
    ? 'mac'
    : 'windows';
};

export const metaKey = (layout: Layout = getLayout()): string => (
  layout === 'mac' ? '⌘' : 'Ctrl'
);
