import TextareaUtils from '../../utils/TextareaUtils';
import CopyUtils from '../../utils/CopyUtils';
import StringUtils from '../../utils/StringUtils';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    TextareaUtils.autoSizeAll();
    CopyUtils.attachCopyButtons();
    const ids = document.querySelectorAll<HTMLElement>('[data-copy-id]');
    ids.forEach((el) => {
      // eslint-disable-next-line no-param-reassign
      el.textContent = StringUtils.softHyphenate(el.textContent || '');
    });
  });
})();
