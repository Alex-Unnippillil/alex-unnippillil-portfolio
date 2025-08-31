const fs = require('fs');
const path = require('path');
const glob = require('glob');
const tokenMap = require('../../src/theme/tokenMap.json');

const patterns = ['src/**/*.scss', 'src/**/*.ejs', 'src/**/*.ts', 'src/**/*.js'];

const files = patterns.flatMap(pattern => glob.sync(pattern, { ignore: ['node_modules/**'] }));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content;

  for (const [raw, token] of Object.entries(tokenMap)) {
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    updated = updated.replace(regex, token);
  }

  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated ${file}`);
  }
});
