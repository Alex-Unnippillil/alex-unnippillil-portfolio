#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { builtinModules } = require('module');

const allowlist = require('../config/node-allowlist.json');
const allowedModules = new Set(Object.keys(allowlist));

const targetDirs = [path.resolve(__dirname, '../src/pages'), path.resolve(__dirname, '../src/modules')];

function isDirectory(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // ignore server-side modules
      if (fullPath.includes(path.join('src', 'modules', 'server'))) return;
      walk(fullPath);
    } else if (/\.(t|j)sx?$/.test(file)) {
      scanFile(fullPath);
    }
  });
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import[^'"`]*['"`]([^'"`]+)['"`]/g;
  const requireRegex = /require\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    checkModule(match[1], file);
  }
  while ((match = requireRegex.exec(content)) !== null) {
    checkModule(match[1], file);
  }
}

function checkModule(mod, file) {
  const clean = mod.replace(/^node:/, '');
  if (clean.startsWith('.') || clean.startsWith('/')) return;
  if (allowedModules.has(clean)) return;
  if (builtinModules.includes(clean) || builtinModules.includes(`node:${clean}`)) {
    console.error(`Node.js builtin module '${mod}' found in client file: ${file}`);
    process.exitCode = 1;
  }
}

for (const dir of targetDirs) {
  if (isDirectory(dir)) {
    walk(dir);
  }
}

if (process.exitCode) {
  process.exit(1);
}
