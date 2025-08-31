import { ConfigSkeleton, withDelayedSkeleton } from '../../components/Skeletons';

withDelayedSkeleton(
  () => new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve());
  }),
  ConfigSkeleton(),
);

(() => {
  console.log('dev');
})();
