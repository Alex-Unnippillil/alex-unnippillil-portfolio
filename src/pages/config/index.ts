import createConfigSkeleton from '../../components/skeletons/config';
import skeletonDelay from '../../lib/skeletonDelay';
import measureCLS from '../../lib/cls';

(() => {
  const skeleton = createConfigSkeleton();
  skeleton.style.display = 'none';
  document.body.prepend(skeleton);

  const cancel = skeletonDelay(() => {
    skeleton.style.display = '';
  }, 300);

  window.addEventListener('load', () => {
    cancel();
    skeleton.remove();
    console.log('dev');
  });

  measureCLS((cls) => {
    console.log('CLS:', cls);
  });
})();
