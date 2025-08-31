export async function guarded<T>(
  allowed: boolean,
  loader: () => Promise<{ default: T }>,
): Promise<T | null> {
  if (!allowed) {
    return null;
  }
  const mod = await loader();
  return mod.default;
}
