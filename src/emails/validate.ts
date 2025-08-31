import fs from 'fs';
import path from 'path';

import { WelcomeEmail } from './templates/WelcomeEmail';
import { PasswordResetEmail } from './templates/PasswordResetEmail';

const welcomeData = require('../../data/email-samples/welcome.json');
const resetData = require('../../data/email-samples/reset-password.json');

type Template = { name: string; html: string };

function inlineCss(html: string): string {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return html;
  const css = styleMatch[1];
  let result = html.replace(styleMatch[0], '');
  const bodyMatch = css.match(/body\s*{([^}]*)}/i);
  if (bodyMatch) {
    result = result.replace('<body', `<body style="${bodyMatch[1].trim()}"`);
  }
  return result;
}

function checkAlt(html: string): void {
  const imgs = html.match(/<img [^>]*>/gi) || [];
  imgs.forEach((tag) => {
    if (!/alt=/.test(tag)) {
      throw new Error('Image missing alt text');
    }
  });
}

function toText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const templates: Template[] = [
  { name: 'welcome', html: WelcomeEmail(welcomeData) },
  { name: 'reset-password', html: PasswordResetEmail(resetData) },
];

templates.forEach((t) => {
  const inlined = inlineCss(t.html);
  checkAlt(inlined);
  const text = toText(inlined);
  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  fs.writeFileSync(path.join(outDir, `${t.name}.html`), inlined);
  fs.writeFileSync(path.join(outDir, `${t.name}.txt`), text);
});
