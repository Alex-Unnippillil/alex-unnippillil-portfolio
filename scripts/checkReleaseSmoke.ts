import fs from 'fs';

interface GateResult {
  status: 'passed' | 'failed' | 'skipped';
  [key: string]: any;
}

interface ReleaseSmoke {
  [gate: string]: GateResult;
}

const file = process.argv[2] || 'reports/release-smoke.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8')) as ReleaseSmoke;

let hasFailure = false;
for (const [gate, result] of Object.entries(data)) {
  if (result.status !== 'passed') {
    console.error(`Gate "${gate}" did not pass (status: ${result.status}).`);
    hasFailure = true;
  } else {
    console.log(`Gate "${gate}" passed.`);
  }
}

if (hasFailure) {
  console.error('Release smoke check failed.');
  process.exit(1);
} else {
  console.log('All release smoke checks passed.');
}
