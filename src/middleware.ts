import { NextResponse } from 'next/server';

const LOCALE_COOKIE = 'locale';
const AB_COOKIE = 'ab-test';
const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'ref',
];

function getCookie(req: Request, name: string): string | undefined {
  const cookie = req.headers.get('cookie');
  if (!cookie) return undefined;
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

export function middleware(request: Request) {
  const url = new URL(request.url);
  let modified = false;

  TRACKING_PARAMS.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      modified = true;
    }
  });

  const response = modified ? NextResponse.redirect(url) : NextResponse.next();

  const country = ((request as any).geo?.country as string) || 'US';
  const acceptLang = request.headers.get('accept-language') || 'en';
  const lang = acceptLang.split(',')[0].split('-')[0];
  const locale = `${lang}-${country}`.toLowerCase();
  const currentLocale = getCookie(request, LOCALE_COOKIE);

  if (currentLocale !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24, path: '/' });
  }

  if (!getCookie(request, AB_COOKIE)) {
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    response.cookies.set(AB_COOKIE, variant, { maxAge: 60 * 60, path: '/' });
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
