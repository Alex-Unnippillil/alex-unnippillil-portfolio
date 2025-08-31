#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MAX_DURATION_MS = 700;

function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else if (/\.(css|scss|js|ts|tsx)$/.test(file)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

const rootDir = path.join(__dirname, '..', 'src');
const files = walk(rootDir);
const regex = /(\d+(?:\.\d+)?)(ms|s)/g;
let hasLong = false;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    let value = parseFloat(match[1]);
    if (match[2] === 's') value *= 1000;
    if (value > MAX_DURATION_MS) {
      console.log(`${file}: ${match[0]} exceeds ${MAX_DURATION_MS}ms`);
      hasLong = true;
    }
  }
});

if (hasLong) {
  process.exit(1);
}
