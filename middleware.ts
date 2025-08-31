// Fetch read-only feature flags from Edge Config and expose via headers.

// eslint-disable-next-line import/no-unresolved
import { get } from '@vercel/edge-config';
// eslint-disable-next-line import/no-unresolved
import { NextRequest, NextResponse } from 'next/server';

interface Flags {
  [key: string]: unknown;
}

let previewFlags: Flags = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  previewFlags = require('./config/flags.preview.json');
} catch {
  // ignore missing preview config
}

async function loadFlags(): Promise<Flags> {
  if (process.env.VERCEL_ENV === 'preview') {
    return previewFlags;
  }

  try {
    const flags = await get<Flags>('flags');
    return flags || {};
  } catch {
    return {};
  }
}

export async function middleware(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest,
) {
  const flags = await loadFlags();
  const res = NextResponse.next();
  res.headers.set('x-feature-flags', JSON.stringify(flags));
  return res;
}

export const config = {
  matcher: '/:path*',
};
