import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window as any);

export interface PasteHandlerOptions {
  /**
   * Callback to upload pasted images. Should return URL of uploaded image.
   */
  uploadImage?: (file: File) => Promise<string> | string | void;
  /**
   * Paste clipboard data as plain text.
   */
  plainText?: boolean;
}

export default class ClipboardUtils {
  /**
   * Sanitize HTML content to prevent XSS.
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html);
  }

  /**
   * Handle paste event, sanitizing HTML and uploading images automatically.
   */
  static async handlePaste(
    event: ClipboardEvent,
    options: PasteHandlerOptions = {},
  ): Promise<void> {
    const { uploadImage, plainText } = options;
    const data = event.clipboardData;
    if (!data) return;

    if (plainText) {
      event.preventDefault();
      const text = data.getData('text/plain');
      document.execCommand('insertText', false, text);
      return;
    }

    // Convert pasted images to uploads
    let imageFile: File | null = null;
    for (let i = 0; i < data.items.length; i += 1) {
      const item = data.items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        imageFile = item.getAsFile();
        break;
      }
    }
    if (imageFile && uploadImage) {
      event.preventDefault();
      const result = await uploadImage(imageFile);
      if (result) {
        document.execCommand('insertImage', false, result);
      }
      return;
    }

    const html = data.getData('text/html');
    if (html) {
      event.preventDefault();
      const sanitized = ClipboardUtils.sanitizeHtml(html);
      document.execCommand('insertHTML', false, sanitized);
      return;
    }

    const text = data.getData('text/plain');
    if (text) {
      event.preventDefault();
      document.execCommand('insertText', false, text);
    }
  }

  /**
   * Attach listeners to element to enable Ctrl+Shift+V plain text paste.
   */
  static enablePlainTextShortcut(element: HTMLElement, options: Omit<PasteHandlerOptions, 'plainText'> = {}): void {
    let forcePlain = false;
    element.addEventListener('keydown', (e) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.shiftKey && e.key.toLowerCase() === 'v') {
        forcePlain = true;
      }
    });

    element.addEventListener('paste', (e) => {
      ClipboardUtils.handlePaste(e, { ...options, plainText: forcePlain });
      forcePlain = false;
    });
  }
}
