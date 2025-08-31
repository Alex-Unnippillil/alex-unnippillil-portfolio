const axios = require('axios');
const fs = require('fs');
const path = require('path');

const THRESHOLDS_PATH = path.join(__dirname, '..', 'speed-insights-budget.json');

async function main() {
  const { DEPLOYMENT_URL, SPEED_INSIGHTS_TOKEN } = process.env;
  if (!DEPLOYMENT_URL || !SPEED_INSIGHTS_TOKEN) {
    console.error('Missing DEPLOYMENT_URL or SPEED_INSIGHTS_TOKEN');
    process.exit(1);
  }

  const thresholds = JSON.parse(fs.readFileSync(THRESHOLDS_PATH, 'utf8'));

  const { data } = await axios.get('https://api.vercel.com/v1/speed-insights', {
    params: { url: DEPLOYMENT_URL },
    headers: { Authorization: `Bearer ${SPEED_INSIGHTS_TOKEN}` },
  });

  const metrics = data.metrics || {};
  const alerts = [];

  Object.keys(thresholds).forEach((key) => {
    const metric = metrics[key];
    const p75 = metric && (metric.p75 || metric.p90 || metric.p95);
    if (p75 && p75 > thresholds[key]) {
      alerts.push(`${key} ${p75}ms > ${thresholds[key]}ms`);
    }
  });

  if (alerts.length) {
    console.log('Speed budget exceeded:', alerts.join(', '));
    process.exit(1);
  } else {
    console.log('Speed budget within limits');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
