import fs from 'fs';
import glob from 'glob';

const tokenMap: Record<string, string> = require('../src/theme/tokenMap.json');
const allowed = new Set(Object.keys(tokenMap).map((k: string) => k.toLowerCase()));

const patterns = ['src/**/*.scss', 'src/**/*.ejs', 'src/**/*.ts', 'src/**/*.js'];
let files: string[] = [];
patterns.forEach((pattern: string) => {
  files = files.concat(glob.sync(pattern, { ignore: ['node_modules/**'] }));
});

const regex = /#[0-9a-fA-F]{3,6}\b/g;

let hasError = false;

files.forEach((file: string) => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(regex);
  if (matches) {
    matches.forEach((m: string) => {
      if (!allowed.has(m.toLowerCase())) {
        console.error(`Hard coded color ${m} found in ${file}`);
        hasError = true;
      }
    });
  }
});

if (hasError) {
  process.exit(1);
} else {
  console.log('No hard coded colors found.');
}
