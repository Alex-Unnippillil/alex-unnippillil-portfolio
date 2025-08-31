import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import axios from 'axios';

interface IMetrics {
  [route: string]: {
    [device: string]: {
      longTaskDuration: number;
      maxMemory: number;
    };
  };
}

function readJSON(filePath: string): any {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

const budgets: IMetrics = readJSON('perf-budgets.json');
const current: IMetrics = readJSON('perf-results.json');

let main: IMetrics = {};
try {
  const mainRaw = execSync('git show origin/main:perf-results.json', { encoding: 'utf8' });
  main = JSON.parse(mainRaw);
} catch (e) {
  console.warn('Unable to read metrics from main branch');
}

let fail = false;
const lines: string[] = ['| Route | Device | Long Task Δ (ms) | Memory Δ (bytes) |', '| --- | --- | --- | --- |'];

Object.keys(current).forEach((route) => {
  const devices = current[route];
  Object.keys(devices).forEach((device) => {
    const cur = devices[device];
    const base = main[route]?.[device] || { longTaskDuration: 0, maxMemory: 0 };
    const budget = budgets[route]?.[device];

    const longDelta = cur.longTaskDuration - base.longTaskDuration;
    const memDelta = cur.maxMemory - base.maxMemory;

    if (budget) {
      if (cur.longTaskDuration > budget.longTaskDuration || cur.maxMemory > budget.maxMemory) {
        fail = true;
      }
    }

    lines.push(`| ${route} | ${device} | ${longDelta.toFixed(2)} | ${memDelta} |`);
  });
});

const commentBody = lines.join('\n');
console.log(commentBody);

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY; // e.g. owner/repo
const prNumber = process.env.PR_NUMBER;

if (token && repo && prNumber) {
  axios.post(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
    body: commentBody,
  }, {
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  }).catch((err) => {
    console.warn('Failed to post comment', err.message);
  });
}

if (fail) {
  console.error('Performance budgets exceeded');
  process.exit(1);
}
