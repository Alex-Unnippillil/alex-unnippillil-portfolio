export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text', err);
    return false;
  }
}

export function copyUrl(url: string): Promise<boolean> {
  return copyText(url);
}

export function copyId(id: string): Promise<boolean> {
  return copyText(id);
}

export function copyCode(code: string): Promise<boolean> {
  return copyText(code);
}
