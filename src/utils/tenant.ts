type ThemeTokens = Record<string, string>;

export interface TenantOgMeta {
  title: string;
  description: string;
  image: string;
}

export interface TenantConfig {
  tokens: ThemeTokens;
  logo: string;
  og: TenantOgMeta;
}

const DEFAULT_TENANT = 'default';

const TENANTS: Record<string, TenantConfig> = {
  'brand-a.example.com': {
    tokens: {
      'color-primary': '#0d6efd',
      'color-secondary': '#6610f2',
    },
    logo: '/assets/brand-a-logo.png',
    og: {
      title: 'Brand A Portfolio',
      description: 'Portfolio for Brand A',
      image: '/assets/brand-a-og.png',
    },
  },
  'brand-b.example.com': {
    tokens: {
      'color-primary': '#198754',
      'color-secondary': '#20c997',
    },
    logo: '/assets/brand-b-logo.png',
    og: {
      title: 'Brand B Portfolio',
      description: 'Portfolio for Brand B',
      image: '/assets/brand-b-og.png',
    },
  },
  [DEFAULT_TENANT]: {
    tokens: {
      'color-primary': '#000000',
      'color-secondary': '#ffffff',
    },
    logo: '/assets/logo.png',
    og: {
      title: 'Portfolio',
      description: 'Default portfolio',
      image: '/assets/og.png',
    },
  },
};

export function getTenantConfig(hostname: string = window.location.hostname): TenantConfig {
  return TENANTS[hostname] || TENANTS[DEFAULT_TENANT];
}

export function createTenantStorage(
  hostname: string = window.location.hostname,
  storage: Storage = window.localStorage,
) {
  return {
    getItem: (key: string) => storage.getItem(`${hostname}:${key}`),
    setItem: (key: string, value: string) => storage.setItem(`${hostname}:${key}`, value),
    removeItem: (key: string) => storage.removeItem(`${hostname}:${key}`),
  };
}

export function applyTenantConfig(doc: Document = document): TenantConfig {
  const tenant = getTenantConfig();
  Object.entries(tenant.tokens).forEach(([key, value]) => {
    (doc as any).documentElement.style.setProperty(`--${key}`, value);
  });
  const logoEl = (doc.getElementById && doc.getElementById('logo')) as HTMLImageElement | null;
  if (logoEl) {
    logoEl.src = tenant.logo;
  }

  const ensureMeta = (property: string, content: string) => {
    let el = doc.head.querySelector(`meta[property='${property}']`) as HTMLMetaElement | null;
    if (!el && doc.createElement) {
      el = doc.createElement('meta');
      el.setAttribute('property', property);
      doc.head.appendChild(el);
    }
    if (el) {
      el.setAttribute('content', content);
    }
  };

  ensureMeta('og:title', tenant.og.title);
  ensureMeta('og:description', tenant.og.description);
  ensureMeta('og:image', tenant.og.image);

  if (typeof window !== 'undefined') {
    (window as any).tenantStorage = createTenantStorage();
  }

  return tenant;
}
