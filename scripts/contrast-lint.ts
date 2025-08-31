import { readFileSync, writeFileSync } from 'fs';
import { autoAdjust, validatePairs, ColorPair } from '../src/utils/Contrast';

const tokenPath = './data/design-tokens.json';
const raw = readFileSync(tokenPath, 'utf8');
const data = JSON.parse(raw) as { pairs: ColorPair[] };

const fix = process.argv.includes('--fix');
let modified = false;

data.pairs.forEach((pair) => {
  if (!validatePairs([pair])) {
    if (fix) {
      const adjusted = autoAdjust(pair.foreground, pair.background);
      // eslint-disable-next-line no-param-reassign
      pair.foreground = adjusted;
      modified = true;
    } else {
      console.error(`Contrast failure for ${pair.name}`);
      process.exitCode = 1;
    }
  }
});

if (fix && modified) {
  writeFileSync(tokenPath, `${JSON.stringify(data, null, 2)}\n`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
