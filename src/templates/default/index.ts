import '../_common/scripts';
import { HomeSkeleton, withDelayedSkeleton } from '../../components/Skeletons';

withDelayedSkeleton(
  () => new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve());
  }),
  HomeSkeleton(),
);
