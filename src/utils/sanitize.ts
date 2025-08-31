import sanitizeHtml from 'sanitize-html';

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
  blocklist?: string[];
}

export function validateUrl(url: string, blocklist: string[] = []): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('#') || url.startsWith('/')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    if (blocklist.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))) {
      return null;
    }

    return parsed.toString();
  } catch (e) {
    return null;
  }
}

export default function sanitize(html: string, options: SanitizeOptions = {}): string {
  const {
    allowedTags = ['a', 'b', 'i', 'em', 'strong', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'img', 'br'],
    allowedAttributes = {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class'],
    },
    blocklist = [],
  } = options;

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    transformTags: {
      a: (tagName, attribs) => {
        const href = validateUrl(attribs.href, blocklist);
        if (!href) {
          return { tagName: 'span', attribs: {} };
        }

        const newAttribs: any = { href };
        if (/^https?:\/\//i.test(href)) {
          newAttribs.rel = 'noopener noreferrer';
          newAttribs.target = '_blank';
        }
        if (attribs.title) {
          newAttribs.title = attribs.title;
        }
        if (attribs.class) {
          newAttribs.class = attribs.class;
        }
        return { tagName, attribs: newAttribs };
      },
    },
  });
}

