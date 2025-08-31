export default class TextareaUtils {
  static autoSize(textarea: HTMLTextAreaElement, maxHeight = 300): void {
    const el = textarea;
    const resize = () => {
      el.style.height = 'auto';
      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    };
    el.addEventListener('input', resize);
    resize();
  }

  static autoSizeAll(selector = 'textarea[data-autosize]', maxHeight = 300): void {
    const textareas = Array.from(document.querySelectorAll<HTMLTextAreaElement>(selector));
    textareas.forEach((ta) => TextareaUtils.autoSize(ta, maxHeight));
  }
}
