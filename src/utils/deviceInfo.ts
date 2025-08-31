export interface IDeviceInfo {
  userAgent: string | null;
  memory: number | null;
  hardwareConcurrency: number | null;
  reducedMotion: boolean;
}

export default function getDeviceInfo(): IDeviceInfo {
  const nav: any = typeof navigator !== 'undefined' ? navigator : {};
  const win: any = typeof window !== 'undefined' ? window : {};

  const userAgent: string | null = nav.userAgent || null;
  const memory: number | null = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null;
  const hardwareConcurrency: number | null =
    typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null;
  const reducedMotion: boolean =
    typeof win.matchMedia === 'function'
      ? win.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return {
    userAgent,
    memory,
    hardwareConcurrency,
    reducedMotion,
  };
}
