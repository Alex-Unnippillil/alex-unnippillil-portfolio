import fs from 'fs';
import path from 'path';

interface Result {
  timestamp: string;
  mount: number;
  update: number;
  unmount: number;
}

const resultsPath = path.resolve(__dirname, '../tests/performance/results.json');
const reportPath = path.resolve(__dirname, '../tests/performance/report.md');

const results: Result[] = fs.existsSync(resultsPath)
  ? JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
  : [];

function trend(field: keyof Omit<Result, 'timestamp'>): string {
  if (results.length < 2) return 'N/A';
  const last = results[results.length - 1][field];
  const prev = results[results.length - 2][field];
  const diff = last - prev;
  const sign = diff >= 0 ? '+' : '-';
  return `${sign}${Math.abs(diff).toFixed(3)}ms`;
}

const lines = [
  '# Performance Report',
  `Entries: ${results.length}`,
  `Mount trend: ${trend('mount')}`,
  `Update trend: ${trend('update')}`,
  `Unmount trend: ${trend('unmount')}`,
];

const output = `${lines.join('\n')}\n`;
fs.writeFileSync(reportPath, output);
console.log(output);
