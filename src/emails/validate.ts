// Simple email validation utility
import fs from 'fs';

export interface ValidationResult {
  html: string;
  text: string;
  missingAlt: string[];
}

function inlineCss(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return html;
  const css = styleMatch[1];
  let result = html.replace(styleMatch[0], '');
  const rules = css.match(/([^{]+){([^}]+)}/g) || [];
  rules.forEach((rule) => {
    const parts = /([^]{1,}){([^}]+)}/.exec(rule);
    if (!parts) return;
    const selector = parts[1].trim();
    const props = parts[2].trim().replace(/\s+/g, ' ');
    if (/^[a-zA-Z]+$/.test(selector)) {
      const regex = new RegExp(`<${selector}([^>]*)>`, 'g');
      result = result.replace(regex, `<${selector}$1 style="${props}">`);
    }
  });
  return result;
}

function extractAltWarnings(html: string): string[] {
  const missing: string[] = [];
  html.replace(/<img([^>]+)>/g, (match, attrs) => {
    if (!/alt=/i.test(attrs)) {
      const src = /src="([^"]+)"/i.exec(attrs);
      missing.push(src ? src[1] : '');
    }
    return match;
  });
  return missing;
}

function toPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateEmail(html: string): ValidationResult {
  const inlined = inlineCss(html);
  const missingAlt = extractAltWarnings(inlined);
  const text = toPlainText(inlined);
  return { html: inlined, text, missingAlt };
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node validate.ts <file.html>');
    process.exit(1);
  }
  const html = fs.readFileSync(file, 'utf8');
  const result = validateEmail(html);
  if (result.missingAlt.length) {
    console.warn('Images missing alt text:', result.missingAlt.join(', '));
  } else {
    console.log('All images have alt text');
  }
  fs.writeFileSync(file.replace(/\.html?$/, '.inline.html'), result.html);
  fs.writeFileSync(file.replace(/\.html?$/, '.txt'), result.text);
}
