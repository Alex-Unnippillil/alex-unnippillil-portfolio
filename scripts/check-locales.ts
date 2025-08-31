/* eslint-disable */
import fs from 'fs';
import path from 'path';

const localeDir = process.argv[2] || path.resolve(__dirname, '../src/locales');
const baseLocale = process.argv[3] || 'en';

function readJson(file: string): any {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function flatten(obj: any, prefix = ''): Record<string, string> {
  const res: Record<string, string> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(res, flatten(value, newKey));
    } else {
      res[newKey] = String(value);
    }
  });
  return res;
}

function placeholders(str: string): Set<string> {
  const matches = str.match(/\{[^}]+\}/g);
  return new Set(matches || []);
}

const basePath = path.join(localeDir, `${baseLocale}.json`);
if (!fs.existsSync(basePath)) {
  console.error(`Base locale "${baseLocale}" not found in ${localeDir}`);
  process.exit(1);
}

const base = flatten(readJson(basePath));

const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json') && f !== `${baseLocale}.json`);
let hasError = false;

files.forEach((file) => {
  const localeName = path.basename(file, '.json');
  const target = flatten(readJson(path.join(localeDir, file)));
  Object.keys(base).forEach((key) => {
    if (!(key in target)) {
      console.error(`[${localeName}] missing key: ${key}`);
      hasError = true;
    } else {
      const basePh = placeholders(base[key]);
      const targetPh = placeholders(target[key]);
      basePh.forEach((ph) => {
        if (!targetPh.has(ph)) {
          console.error(`[${localeName}] placeholder mismatch for "${key}": missing ${ph}`);
          hasError = true;
        }
      });
    }
  });
});

if (hasError) {
  process.exit(1);
} else {
  console.log('All locale files validated successfully.');
}

