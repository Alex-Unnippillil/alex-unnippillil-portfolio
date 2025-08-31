#!/usr/bin/env node
const { execSync } = require('child_process');

let output;
try {
  output = execSync('npm ls --all --json', {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
} catch (err) {
  // npm ls exits with non-zero code when there are problems, but still
  // produces JSON output on stdout. Use it to continue processing.
  output = err.stdout;
}

const tree = JSON.parse(output);
const versions = new Map();

function collect(deps) {
  if (!deps) return;
  for (const [name, info] of Object.entries(deps)) {
    if (!versions.has(name)) versions.set(name, new Set());
    versions.get(name).add(info.version);
    collect(info.dependencies);
  }
}

collect(tree.dependencies);

const duplicates = Array.from(versions.entries()).filter(([, set]) => set.size > 1);

if (duplicates.length > 0) {
  console.error('Duplicate packages detected:');
  for (const [name, set] of duplicates) {
    console.error(`  ${name}: ${Array.from(set).join(', ')}`);
  }
  process.exit(1);
}

