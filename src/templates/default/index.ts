import '../_common/scripts';
import createPersonalizedSkeleton from '../../modules/skeletons/PersonalizedSkeleton';
import fetchPersonalized from '../../modules/fetch/clientPersonalized';
import '../../modules/skeletons/skeleton.scss';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('personalized');
  if (!container) {
    return;
  }

  const skeleton = createPersonalizedSkeleton();
  container.appendChild(skeleton);

  fetchPersonalized().then((data) => {
    container.removeChild(skeleton);
    container.textContent = data.message;
  });
});
