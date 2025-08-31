import '../_common/scripts';
import createDefaultSkeleton from '../../components/skeletons/default';
import skeletonDelay from '../../lib/skeletonDelay';
import measureCLS from '../../lib/cls';

const skeleton = createDefaultSkeleton();
skeleton.style.display = 'none';
document.body.prepend(skeleton);

const cancel = skeletonDelay(() => {
  skeleton.style.display = '';
}, 300);

window.addEventListener('load', () => {
  cancel();
  skeleton.remove();
});

measureCLS((cls) => {
  console.log('CLS:', cls);
});
