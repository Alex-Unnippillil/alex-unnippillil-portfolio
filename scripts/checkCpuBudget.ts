import fs from 'fs';
import path from 'path';

const { getCostReport } = require('./cpu-cost-report');

const budgetsPath = path.resolve(__dirname, '../config/cpu-budgets.json');
const budgets = fs.existsSync(budgetsPath)
  ? JSON.parse(fs.readFileSync(budgetsPath, 'utf8'))
  : {};

const report = getCostReport();
let ok = true;

Object.entries(report).forEach(([route, cost]) => {
  const budget = (budgets as any)[route];
  if (typeof budget === 'number' && (cost as number) > budget) {
    console.error(`${route} exceeds CPU budget: ${cost} > ${budget}`);
    ok = false;
  }
});

if (!ok) {
  process.exit(1);
} else {
  console.log('All routes within CPU budgets');
}
