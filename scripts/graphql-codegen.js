const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const operationsDir = path.resolve(__dirname, '../src/graphql/operations');
const typesFile = path.resolve(__dirname, '../src/graphql/types.d.ts');
const opsFile = path.resolve(__dirname, '../src/graphql/operations.json');

const files = fs.readdirSync(operationsDir).filter((f) => f.endsWith('.graphql'));
const types = [];
const ops = {};

files.forEach((file) => {
  const name = path.basename(file, '.graphql');
  const content = fs.readFileSync(path.join(operationsDir, file), 'utf8').trim();
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  ops[hash] = content;
  types.push(`/** @typedef {{}} ${name}Data */\n/** @typedef {{}} ${name}Variables */\n`);
});

fs.writeFileSync(typesFile, `${types.join('\n')}\n`);
fs.writeFileSync(opsFile, `${JSON.stringify(ops, null, 2)}\n`);

