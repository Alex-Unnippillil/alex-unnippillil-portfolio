export default class CopyButton {
  private text: string;
  private button: HTMLElement;

  constructor(button: HTMLElement, text: string) {
    this.button = button;
    this.text = text;
    this.button.addEventListener('click', () => this.copy());
  }

  private async copy() {
    try {
      await navigator.clipboard.writeText(this.text);
      CopyButton.toast('Copied to clipboard');
      return;
    } catch (err) {
      // Fallback for older browsers
    }

    const textarea = document.createElement('textarea');
    textarea.value = this.text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-1000px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      CopyButton.toast('Copied to clipboard');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  static init() {
    // Copy buttons for code snippets
    document.querySelectorAll('pre code').forEach((block) => {
      const pre = block.parentElement as HTMLElement;
      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.className = 'copy-button';
      pre.style.position = 'relative';
      button.style.position = 'absolute';
      button.style.top = '0.25rem';
      button.style.right = '0.25rem';
      pre.appendChild(button);
      // eslint-disable-next-line no-new
      new CopyButton(button, (block as HTMLElement).innerText);
    });

    // Copy buttons for elements with data-copy-id
    document.querySelectorAll('[data-copy-id]').forEach((el) => {
      const id = (el as HTMLElement).getAttribute('id');
      if (!id) {
        return;
      }
      const button = document.createElement('button');
      button.textContent = 'Copy ID';
      button.className = 'copy-button';
      (el as HTMLElement).appendChild(button);
      // eslint-disable-next-line no-new
      new CopyButton(button, id);
    });
  }

  private static toast(message: string) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '1rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '0.5rem 1rem';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '10000';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
}
