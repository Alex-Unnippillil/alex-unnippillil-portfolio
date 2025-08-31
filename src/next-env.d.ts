/* eslint-disable import/prefer-default-export */
declare module 'next/server' {
  export class NextResponse extends Response {
    static next(init?: { headers?: HeadersInit }): NextResponse;
    static redirect(url: URL, status?: number): NextResponse;
    cookies: {
      get(name: string): { value: string } | undefined;
      set(name: string, value: string, options?: { maxAge?: number; path?: string }): void;
    };
  }
}
