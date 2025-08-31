export function scopeCss(scope: string, css: string): string {
  const prefix = `.${scope}`;

  // Prefix selectors with the scope. This is a minimal implementation and
  // doesn't aim to cover all CSS features, but it is sufficient for tests.
  return css.replace(/(^|})\s*([^@{}][^{]*?)\s*{/g, (_, start, selector) => {
    const scoped = selector
      .split(',')
      .map((s: string) => `${prefix} ${s.trim()}`)
      .join(', ');
    return `${start} ${scoped} {`;
  });
}

export function createScopedStyle(scope: string, css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = scopeCss(scope, css);
  return style;
}
