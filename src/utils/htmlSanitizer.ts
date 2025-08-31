import pasteLogger from '../dev/PasteLogger';

export interface SanitizationResult {
  sanitizedHtml: string;
  strippedElements: string[];
}

export default class HtmlSanitizer {
  static sanitize(html: string): SanitizationResult {
    const strippedElements: string[] = [];

    const sanitizedHtml = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, (_match, tag) => {
      strippedElements.push((tag as string).toLowerCase());
      return '';
    });

    pasteLogger(strippedElements);

    return {
      sanitizedHtml,
      strippedElements,
    };
  }
}
