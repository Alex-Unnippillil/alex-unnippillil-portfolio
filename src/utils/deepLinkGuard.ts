export interface DeepLinkParams {
  [key: string]: string;
}

/**
 * Try to parse a deep link and reject obviously unsafe values.
 * A safe link is expected to:
 *  - be a string shorter than `maxLength`
 *  - be a valid URL or query string
 *  - contain query parameter values made of safe characters
 *
 * On success the function returns parsed query parameters,
 * otherwise it returns `null`.
 */
export default function deepLinkGuard(link: string, maxLength = 2048): DeepLinkParams | null {
  if (typeof link !== 'string') {
    return null;
  }

  // Reject extremely long links – they may be an attack vector
  if (link.length > maxLength) {
    return null;
  }

  let url: URL;

  try {
    // Support both full URLs and query strings ("?foo=bar")
    url = link.startsWith('http://') || link.startsWith('https://')
      ? new URL(link)
      : new URL(link, 'http://local');
  } catch (e) {
    // Malformed URI
    return null;
  }

  const params: DeepLinkParams = {};

  // Only allow alphanumeric, dash, underscore, dot and slash in param values
  const unsafe = /[^\w\-./]/;

  // Iterate through parameters and validate
  url.searchParams.forEach((value, key) => {
    if (unsafe.test(value)) {
      params.__unsafe = '1';
      return;
    }

    if (value.length > 256) {
      params.__unsafe = '1';
      return;
    }

    params[key] = value;
  });

  if ('__unsafe' in params) {
    return null;
  }

  return params;
}
