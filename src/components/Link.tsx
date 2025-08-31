interface LinkProps {
  href: string;
  children?: any;
  [key: string]: any;
}

const ALLOWLIST = ['github.com', 'linkedin.com'];

export function isAllowedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWLIST.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export default function Link({ href, children, ...rest }: LinkProps): any {
  if (!isAllowedUrl(href)) {
    return null;
  }

  return {
    type: 'a',
    props: {
      href,
      rel: 'noopener noreferrer',
      target: '_blank',
      ...rest,
      children,
    },
  };
}

export { ALLOWLIST };
