export default class CopyUtils {
  static attachCopyButtons(selector = '[data-copy-id]'): void {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    elements.forEach((el) => {
      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.className = 'copy-btn';
      button.addEventListener('click', () => {
        const text = el.textContent || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }
      });
      el.insertAdjacentElement('afterend', button);
    });
  }
}
